/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';
import { delay, switchMap, tap } from 'rxjs';
import { environment } from '../../../../../env';
import { Device } from '../../../api/models/device.model';
import { ValveDevice, ValveStatusCode } from '../../../api/models/valve.model';
import { DeviceApiService } from '../../../api/services/device-api.service';
import { getStatus, getStatusIndex } from '../../utils/device.utils';
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
export class DeviceValveComponent {
  @Input({ required: true }) device!: ValveDevice;
  deviceValues = deviceValues;

  constructor(
    private deviceApiService: DeviceApiService,
  ) { }

  getMode(device: Device): string {
    return getStatus(device, ValveStatusCode.MODE);
  }

  getState(device: Device): string {
    return getStatus(device, ValveStatusCode.STATE);
  }

  getTemperatureSet(device: Device): number {
    return (getStatus(device, ValveStatusCode.TEMPERATURE_SET) ?? 0) / 10;
  }

  getTemperature(device: Device): number {
    return (getStatus(device, ValveStatusCode.TEMPERATURE) ?? 0) / 10;
  }

  setTemperature(device: Device, change: number): void {
    const newTemp = (this.getTemperatureSet(device) + change) * 10;

    this.setValve(
      device,
      [
        {
          code: ValveStatusCode.TEMPERATURE_SET,
          value: newTemp,
        },
      ],
      () => {
        const index = getStatusIndex(device, ValveStatusCode.TEMPERATURE_SET);
        if (index !== undefined) device.status[index].value = newTemp;
      },
    );
  }

  setMode(device: Device, newMode: string): void {
    this.setValve(
      device,
      [
        {
          code: ValveStatusCode.MODE,
          value: newMode,
        },
      ],
      () => {
        const index = getStatusIndex(device, ValveStatusCode.MODE);
        if (index !== undefined) device.status[index].value = newMode;
      },
    );
  }

  private setValve(
    device: Device,
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
