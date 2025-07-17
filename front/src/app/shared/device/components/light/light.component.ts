/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';
import { Device } from '../../../api/models/device.model';
import { LightDevice, LightStatusCode } from '../../../api/models/light.model';
import { DeviceApiService } from '../../../api/services/device-api.service';
import { getStatus, getStatusIndex } from '../../utils/device.utils';

@Component({
  selector: 'app-device-light',
  templateUrl: './light.component.html',
  styleUrls: [
    '../socket/socket.component.scss',
    '../device.scss',
  ],
  standalone: true,
  providers: [DeviceApiService],
})
export class DeviceLightComponent {
  @Input({ required: true }) device!: LightDevice;

  constructor(
    private deviceApiService: DeviceApiService,
  ) { }

  getSwitch(device: Device): boolean {
    return getStatus(device, LightStatusCode.SWITCH);
  }

  toggleLight(device: Device): void {
    if (!device.online) return;

    const newValue = !this.getSwitch(device);
    this.deviceApiService.setDevice(
      device.id,
      [
        {
          code: LightStatusCode.SWITCH,
          value: newValue,
        },
      ],
    ).subscribe(() => {
      const index = getStatusIndex(device, LightStatusCode.SWITCH);
      if (index !== undefined) device.status[index].value = newValue;
    });
  }
}
