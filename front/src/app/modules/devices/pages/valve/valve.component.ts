import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { catchError, of, switchMap, timer } from 'rxjs';
import { environment } from '../../../../../env';
import { ErrorModel } from '../../../../core/api/models/error.model';
import { CoreModule } from '../../../../core/core.module';
import { DeviceLog } from '../../../../shared/api/models/device.model';
import { ValveDevice, ValveState, ValveStatusCode } from '../../../../shared/api/models/valve.model';
import { DeviceApiService } from '../../../../shared/api/services/device-api.service';
import { ValveDataPoint } from '../../../models/valve-chart.model';
import { MessageComponent } from '../../components/message/message.component';
import { chartGranularity, chartOptions, colors, datasetOptionsTemperature, datasetOptionsTemperatureSet, logsPeriod } from './config';

@Component({
  selector: 'app-valve',
  templateUrl: './valve.component.html',
  styleUrls: [
    './valve.component.scss',
    '../../components/device.scss',
  ],
  standalone: true,
  providers: [DeviceApiService],
  imports: [
    CoreModule,
    MessageComponent,
  ],
})
export class ValveComponent implements OnInit {
  deviceId?: string;
  device?: ValveDevice;
  deviceLogsTemperature?: DeviceLog[];
  deviceLogsTemperatureSet?: DeviceLog[];
  error?: ErrorModel;

  // Chart
  chartName = 'chart';
  chart?: Chart<'line', object[]>;

  // Dates range
  currentDate = new Date();
  fromDate = new Date(this.currentDate.getTime() - (logsPeriod * 60 * 60 * 1000));

  constructor(
    public location: Location,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private deviceApiService: DeviceApiService,
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(({ id }) => {
          this.deviceId = id;
          this.retrieveDevice(id);

          return timer(0, environment.deviceLogsRefreshDelay * 60 * 1000);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (!this.deviceId) return;

        const fromDate = this.chart ? this.currentDate : this.fromDate;
        this.currentDate = new Date();
        this.retrieveDeviceLogs(this.deviceId, fromDate, this.currentDate);
      });
  }

  private retrieveDevice(deviceId: string): void {
    this.deviceApiService.getDevice(deviceId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((device) => {
        this.device = device as ValveDevice;
      });
  }

  private retrieveDeviceLogs(deviceId: string, fromDate: Date, toDate: Date): void {
    this.deviceApiService.getLogs(
      deviceId,
      {
        startTime: fromDate,
        endTime: toDate,
        codes: [
          ValveStatusCode.TEMPERATURE,
          ValveStatusCode.STATE,
          ValveStatusCode.TEMPERATURE_SET,
        ],
      },
    )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((e: HttpErrorResponse) => {
          this.error = e.error;
          return of();
        }),
      )
      .subscribe((logs) => {
        // Clear error
        this.error = undefined;

        this.handleDeviceLogsUpdate(logs);
      });
  }

  private handleDeviceLogsUpdate(deviceLogs: DeviceLog[]): void {
    const { deviceLogsTemperature, deviceLogsTemperatureSet } = this.separateDeviceLogsByType(deviceLogs);

    this.deviceLogsTemperature = [
      ...this.deviceLogsTemperature ?? [],
      ...deviceLogsTemperature,
    ];

    this.deviceLogsTemperatureSet = [
      ...this.deviceLogsTemperatureSet ?? [],
      ...deviceLogsTemperatureSet,
    ];

    const dataPointsTemperature = this.getDataPointsTemperature(this.deviceLogsTemperature);
    const dataPointsTemperatureSet = this.getDataPointsTemperatureSet(this.deviceLogsTemperatureSet);

    this.chart?.destroy();
    this.chart = this.createChart(dataPointsTemperature, dataPointsTemperatureSet);
  }

  private separateDeviceLogsByType(deviceLogs: DeviceLog[] = []): {
    deviceLogsTemperature: DeviceLog[];
    deviceLogsTemperatureSet: DeviceLog[];
  } {
    const deviceLogsTemperature: DeviceLog[] = [];
    const deviceLogsTemperatureSet: DeviceLog[] = [];

    deviceLogs.forEach((log) => {
      if ([
        ValveStatusCode.STATE,
        ValveStatusCode.TEMPERATURE,
      ].includes(log.code as ValveStatusCode)) {
        deviceLogsTemperature.push(log);
      } else if ([ValveStatusCode.TEMPERATURE_SET].includes(log.code as ValveStatusCode)) {
        deviceLogsTemperatureSet.push(log);
      }
    });

    return {
      deviceLogsTemperature,
      deviceLogsTemperatureSet,
    };
  }

  private getDataPointsTemperature(deviceLogs: DeviceLog[]): ValveDataPoint[] {
    let lastTemperature: number | undefined;
    let lastState: ValveState = ValveState.CLOSE; // Assume valve is closed before first log

    let dataPoints = deviceLogs.reduce(
      (acc: ValveDataPoint[], log, index) => {
        // 1. Map log to add state to temperature log and temperature to state log
        const logToAdd: {
          date: Date;
          code: string;
          temperature?: number;
          state?: ValveState;
        } = {
          date: log.date,
          code: log.code,
        };

        if (log.code === ValveStatusCode.TEMPERATURE) {
          logToAdd.temperature = Number(log.value);

          // Add lastState to temperature log
          logToAdd.state = lastState;
          lastTemperature = logToAdd.temperature;
        } else if (log.code === ValveStatusCode.STATE) {
          logToAdd.state = log.value as ValveState;

          // Add lastTemperature to state log
          logToAdd.temperature = lastTemperature;
          lastState = logToAdd.state;
        }

        // 2. Filter log if temperature is undefined (if first log is state log)
        if (logToAdd.temperature === undefined) {
          return acc;
        }

        // 3. Filter log if difference with next log is less than granularity to avoid overlapping
        const nextLog = deviceLogs[index + 1];
        // Always keep state change log, otherwise check for granularity
        if (logToAdd.code !== ValveStatusCode.STATE && nextLog?.date) {
          const diff = (nextLog.date.getTime() - logToAdd.date.getTime()) / (60 * 1000);
          if (diff < chartGranularity) {
            return acc;
          }
        }

        // 4. Map log to chart data format
        const dataPoint: ValveDataPoint = {
          x: logToAdd.date,
          y: Number(logToAdd.temperature) / 10,
          state: logToAdd.state,
        };

        acc.push(dataPoint);
        return acc;
      },
      [],
    );

    // 5. Add first log at fromDate to have a continuous line
    const firstDataPoint = dataPoints[0];
    if (firstDataPoint) {
      dataPoints = [
        {
          ...firstDataPoint,
          x: this.fromDate,
          state: ValveState.CLOSE, // Assume valve is closed before first log
        },
        ...dataPoints,
      ];
    }

    // 6. Add last log at currentDate to have a continuous line
    const lastDataPoint = dataPoints.at(-1);
    if (lastDataPoint) {
      dataPoints = [
        ...dataPoints,
        {
          ...lastDataPoint,
          x: this.currentDate,
        },
      ];
    }

    return dataPoints;
  }

  private getDataPointsTemperatureSet(deviceLogs: DeviceLog[]): ValveDataPoint[] {
    // 1. Map log to chart data format
    let dataPoints = deviceLogs.map((log) => ({
      x: log.date,
      y: Number(log.value) / 10,
    }));

    // 2. Don't add first log at fromDate because temperature set value is not known before first log

    // 3. Add last log at currentDate to have a continuous line
    const lastDataPoint = dataPoints.at(-1);
    if (lastDataPoint) {
      dataPoints = [
        ...dataPoints,
        {
          ...lastDataPoint,
          x: this.currentDate,
        },
      ];
    }

    return dataPoints;
  }

  private createChart(
    dataPointsTemperature: ValveDataPoint[],
    dataPointsTemperatureSet: ValveDataPoint[],
  ): Chart<'line', object[]> {
    return new Chart(
      this.chartName,
      {
        type: 'line',
        options: chartOptions,
        data: {
          datasets: [
            {
              ...datasetOptionsTemperature,
              data: dataPointsTemperature,
              segment: {
                borderColor: (context): string => {
                  const value = context.p0.getProps(['raw']).raw as ValveDataPoint;
                  return value?.state === ValveState.OPEN ? colors.stateOpen : colors.stateClose;
                },
              },
            },
            {
              ...datasetOptionsTemperatureSet,
              data: dataPointsTemperatureSet,
            },
          ],
        },
      },
    );
  }
}
