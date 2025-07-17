/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';
import { delay, switchMap, tap } from 'rxjs';
import { environment } from '../../../../../env';
import { ValveDevice, ValveMode, ValveState, ValveStatus, ValveStatusCode } from '../../../api/models/valve.model';
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
  valveMode = ValveMode;
  valveState = ValveState;

  constructor(
    private deviceApiService: DeviceApiService,
  ) { }

  get mode(): string {
    return getStatus(this.device, ValveStatusCode.MODE);
  }

  get state(): string {
    return getStatus(this.device, ValveStatusCode.STATE);
  }

  get temperatureSet(): number {
    return (getStatus(this.device, ValveStatusCode.TEMPERATURE_SET) ?? 0) / 10;
  }

  get temperature(): number {
    return (getStatus(this.device, ValveStatusCode.TEMPERATURE) ?? 0) / 10;
  }

  set mode(newMode: string) {
    this.setValve(
      [
        {
          code: ValveStatusCode.MODE,
          value: newMode,
        },
      ],
      () => {
        const index = getStatusIndex(this.device, ValveStatusCode.MODE);
        if (index !== undefined) this.device.status[index].value = newMode;
      },
    );
  }

  set temperatureSet(change: number) {
    const newTemp = (this.temperatureSet + change) * 10;

    this.setValve(
      [
        {
          code: ValveStatusCode.TEMPERATURE_SET,
          value: newTemp,
        },
      ],
      () => {
        const index = getStatusIndex(this.device, ValveStatusCode.TEMPERATURE_SET);
        if (index !== undefined) this.device.status[index].value = newTemp;
      },
    );
  }
  private setValve(
    commands: {
      code: string;
      value: unknown;
    }[],
    onSuccess: () => void,
  ): void {
    if (!this.device.online) return;

    this.deviceApiService.setDevice(this.device.id, commands)
      .pipe(
        tap(() => {
          onSuccess();
        }),
        // wait for device to execute the command
        delay(environment.waitingDelay * 1000),
        // retrieve device status
        switchMap(() => this.deviceApiService.getDevice(this.device.id)),
      )
      .subscribe((result) => {
        // update device status
        this.device.status = result.status as ValveStatus[];
      });
  }
}
