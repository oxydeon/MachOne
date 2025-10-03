import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import { forkJoin } from 'rxjs';
import { Api } from '../../../../core/api/services/api.service';
import { DeviceLog } from '../../../../shared/api/models/device.model';
import { ValveDevice, ValveStatusCode } from '../../../../shared/api/models/valve.model';
import { DeviceApiService } from '../../../../shared/api/services/device-api.service';
import { maxYAxis, range } from './config';

@Component({
  selector: 'app-valve',
  templateUrl: './valve.component.html',
  styleUrls: [
    './valve.component.scss',
    '../../components/device.scss',
  ],
  standalone: true,
  providers: [
    Api,
    DeviceApiService,
  ],
})
export class ValveComponent implements OnInit {
  device?: ValveDevice;
  logs?: DeviceLog[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chart!: any;

  constructor(
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private deviceApiService: DeviceApiService,
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ id }) => {
        this.retrieveDevice(id);
      });
  }

  retrieveDevice(deviceId: string): void {
    forkJoin({
      device: this.deviceApiService.getDevice(deviceId),
      logs: this.deviceApiService.getLogs(deviceId, {
        startTime: new Date(Date.now() - range),
        endTime: new Date(),
        codes: [
          ValveStatusCode.MODE,
          ValveStatusCode.TEMPERATURE,
          ValveStatusCode.TEMPERATURE_SET,
          ValveStatusCode.STATE,
        ],
      }),
    }).subscribe(({ device, logs }) => {
      this.device = device as ValveDevice;
      this.logs = logs.logs;
      this.createChart();
    });
  }

  createChart(): void {
    this.chart = new Chart('chart', {
      type: 'line',
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: maxYAxis,
          },
        },
      },
      data: {
        labels: Array.from({ length: 25 }, (_, i) => `${i} h`),
        datasets: [
          {
            label: ValveStatusCode.TEMPERATURE,
            data: [
              11,
              11,
              11,
              11,
              11,
              11,
              16,
              16,
              17,
              18,
              20,
              20,
              20,
              22,
              20,
              20,
              23,
              24,
              24,
              20,
              18,
              18,
              16,
              16,
              16,
            ],
            fill: false,
            borderColor: '#4a90e2',
            tension: 0.1,
          },
          {
            label: ValveStatusCode.TEMPERATURE_SET,
            data: [
              5,
              5,
              5,
              5,
              5,
              5,
              16,
              16,
              16,
              16,
              20,
              20,
              20,
              20,
              20,
              20,
              20,
              20,
              20,
              20,
              16,
              16,
              16,
              16,
              16,
            ],
            fill: false,
            stepped: true,
            borderColor: '#004d98',
            tension: 0.1,
          },
        ],
      },
    });
  }
}
