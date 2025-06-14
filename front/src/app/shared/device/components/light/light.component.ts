/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';
import { Device, StatusCode } from '../../../api/models/device.model';
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
  @Input({ required: true }) device!: Device;

  constructor(
    private deviceApiService: DeviceApiService,
  ) { }

  getSwitch(device: Device): boolean {
    return getStatus(device, StatusCode.SWITCH_LIGHT);
  }

  toggleLight(device: Device): void {
    if (!device.online) return;

    const newValue = !this.getSwitch(device);
    this.deviceApiService.setDevice(
      device.id,
      [
        {
          code: StatusCode.SWITCH_LIGHT,
          value: newValue,
        },
      ],
    ).subscribe(() => {
      const index = getStatusIndex(device, StatusCode.SWITCH_LIGHT);
      if (index !== undefined) device.status[index].value = newValue;
    });
  }
}
