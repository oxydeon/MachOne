/* eslint-disable no-param-reassign */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { delay, filter, map, switchMap, tap } from 'rxjs';
import { deviceValue, devicesList, waitingDelay } from './config';
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
  devices?: any[];
  deviceValue = deviceValue;

  constructor(
    private route: ActivatedRoute,
    private api: Api,
    private deviceApiService: DeviceApiService,
  ) { }

  ngOnInit(): void {
    // retrieve credentials from query params
    this.route.queryParams
      .pipe(
        // set credentials
        map((params) => {
          this.api.auth(params['appKey'], params['secretKey']);
          return params;
        }),
        // stop if credentials are not set
        filter((params) => !!params['appKey'] && !!params['secretKey']),
        // retrieve devices
        switchMap(() => this.deviceApiService.getDevices(Object.values(devicesList))),
      )
      .subscribe((devices) => {
        // order devices
        const devicesOrder = Object.keys(devicesList);
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
        delay(waitingDelay * 1000),
        // retrieve device status
        switchMap(() => this.deviceApiService.getDevice(device.id)),
      )
      .subscribe((result) => {
        // update device status
        device.status = result.status;
      });
  }
}
