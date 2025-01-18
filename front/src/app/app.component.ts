/* eslint-disable no-param-reassign */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, delay, switchMap, tap } from 'rxjs';
import { environment } from '../env';
import { deviceValues } from './config';
import { Api } from './core/api/services/api.service';
import { CoreModule } from './core/core.module';
import { DeviceApiService } from './shared/api/services/device-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    CoreModule,
    RouterModule,
  ],
  providers: [DeviceApiService],
})
export class AppComponent implements OnInit {
  baseUrl = window.location.origin;
  deviceValues = deviceValues;

  devices?: any[];
  errorMessage?: string;

  constructor(
    private route: ActivatedRoute,
    public api: Api,
    private deviceApiService: DeviceApiService,
  ) { }

  ngOnInit(): void {
    // retrieve credentials from query params
    this.route.queryParams.subscribe((params) => {
      if (!params['appKey'] || !params['secretKey']) return;

      this.api.auth(params['appKey'], params['secretKey']);

      this.retrieveDevices();

      setInterval(
        () => this.retrieveDevices(),
        environment.refreshDelay * 1000,
      );
    });
  }

  retrieveDevices(): void {
    this.deviceApiService.getDevices(Object.values(environment.devicesList))
      .pipe(
        catchError((e: HttpErrorResponse) => {
          const { error, message } = e.error;
          this.errorMessage = error && message ? `${error} - ${message}` : 'An error occurred';
          return [];
        }),
      )
      .subscribe((devices) => {
        // order devices
        const devicesOrder = Object.keys(environment.devicesList);
        this.devices = devices.sort(
          (a, b) => devicesOrder.indexOf(a.name.trim()) - devicesOrder.indexOf(b.name.trim()),
        );
      });
  }

  toggleLight(device: any): void {
    if (!device.online) return;

    const newValue = !device.status?.[0].value;
    this.deviceApiService.setDevice(
      device.id,
      [
        {
          code: 'switch_1',
          value: newValue,
        },
      ],
    ).subscribe(() => {
      device.status[0].value = newValue;
    });
  }

  setTemperature(device: any, change: number): void {
    if (!device.online) return;

    const newValue = device.status[2].value + (change * 10);
    this.deviceApiService.setDevice(
      device.id,
      [
        {
          code: 'temp_set',
          value: newValue,
        },
      ],
    )
      .pipe(
        // update device temperature
        tap(() => {
          device.status[2].value = newValue;
        }),
        // wait for device to execute the command
        delay(environment.waitingDelay * 1000),
        // retrieve device status
        switchMap(() => this.deviceApiService.getDevice(device.id)),
      )
      .subscribe((result) => {
        // update device status
        device.status = result.status;
      });
  }
}
