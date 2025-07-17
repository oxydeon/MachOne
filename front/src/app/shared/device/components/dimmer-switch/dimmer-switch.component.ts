import { Component, Input } from '@angular/core';
import { IsNotNullishPipe } from '../../../../core/validation/pipes/is-not-nullish.pipe';
import { DimmerSwitchDevice, DimmerSwitchItem, dimmerSwitchItemStatus } from '../../../api/models/dimmer-switch.model';
import { DeviceApiService } from '../../../api/services/device-api.service';
import { getStatus, getStatusIndex } from '../../utils/device.utils';

@Component({
  selector: 'app-device-dimmer-switch',
  templateUrl: './dimmer-switch.component.html',
  styleUrls: [
    'dimmer-switch.component.scss',
    '../device.scss',
  ],
  standalone: true,
  providers: [DeviceApiService],
  imports: [IsNotNullishPipe],
})
export class DeviceDimmerSwitchComponent {
  @Input({ required: true }) device!: DimmerSwitchDevice;
  switches = dimmerSwitchItemStatus;

  constructor(
    private deviceApiService: DeviceApiService,
  ) { }

  getStatus<T>(switchIndex: number, statusCode: keyof DimmerSwitchItem): T {
    return getStatus(this.device, this.switches[switchIndex][statusCode]);
  }

  getBrightnessPercentage(switchIndex: number): number {
    return this.getStatus<number>(switchIndex, 'brightness')
      / this.getStatus<number>(switchIndex, 'brightnessMax');
  }

  toggleLight(switchIndex: number): void {
    if (!this.device.online) return;

    const statusCode = this.switches[switchIndex].status;
    const newValue = !getStatus(this.device, statusCode);
    this.deviceApiService.setDevice(
      this.device.id,
      [
        {
          code: statusCode,
          value: newValue,
        },
      ],
    ).subscribe(() => {
      const index = getStatusIndex(this.device, statusCode);
      if (index !== undefined) this.device.status[index].value = newValue;
    });
  }

  setBrightness(switchIndex: number, brightnessValue: number): void {
    if (!this.device.online) return;

    const statusCode = this.switches[switchIndex].brightness;
    this.deviceApiService.setDevice(
      this.device.id,
      [
        {
          code: statusCode,
          value: brightnessValue,
        },
      ],
    ).subscribe(() => {
      const index = getStatusIndex(this.device, statusCode);
      if (index !== undefined) this.device.status[index].value = brightnessValue;
    });
  }

  displayBrightnessBackground(): boolean {
    return this.device.online
      // has only one switch
      && !!this.getStatus(0, 'brightness')
      && !this.getStatus(1, 'brightness')
      // is turned on
      && !!this.getStatus<boolean>(0, 'status');
  }
}
