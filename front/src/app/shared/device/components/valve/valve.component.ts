/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';
import { delay, switchMap, tap } from 'rxjs';
import { environment } from '../../../../../env';
import { DeviceApiService } from '../../../api/services/device-api.service';
import { deviceValues } from './config';

@Component({
  selector: 'app-device-valve',
  templateUrl: './valve.component.html',
  styleUrls: [
    './valve.component.scss',
    '../device.scss',
  ],
  standalone: true,
  providers: [DeviceApiService],
})
export class DeviceValvetComponent {
  @Input() device: any;
  deviceValues = deviceValues;

  constructor(
    private deviceApiService: DeviceApiService,
  ) { }

  getValveMode(device: any): string {
    return device.status?.[0]?.value;
  }

  getValveState(device: any): string {
    return device.status?.[1]?.value;
  }

  getTemperatureSet(device: any): number {
    return (device.status?.[2]?.value ?? 0) / 10;
  }

  getTemperature(device: any): number {
    return (device.status?.[3]?.value ?? 0) / 10;
  }

  setTemperature(device: any, change: number): void {
    const newTemp = device.status[2].value + (change * 10);

    this.setValve(
      device,
      [
        {
          code: 'temp_set',
          value: newTemp,
        },
      ],
      () => {
        device.status[2].value = newTemp;
      },
    );
  }

  setMode(device: any, newMode: string): void {
    this.setValve(
      device,
      [
        {
          code: 'mode',
          value: newMode,
        },
      ],
      () => {
        device.status[0].value = newMode;
      },
    );
  }

  private setValve(
    device: any,
    commands: {
      code: string;
      value: unknown;
    }[],
    onSuccess: () => void,
  ): void {
    if (!device.online) return;

    this.deviceApiService.setDevice(device.id, commands)
      .pipe(
        tap(() => {
          onSuccess();
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
