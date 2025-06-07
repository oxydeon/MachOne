/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';
import { Device, StatusCode } from '../../../api/models/device.model';
import { DeviceApiService } from '../../../api/services/device-api.service';
import { getStatus, getStatusIndex } from '../../utils/device.utils';

@Component({
  selector: 'app-device-socket',
  templateUrl: './socket.component.html',
  styleUrls: [
    './socket.component.scss',
    '../device.scss',
  ],
  standalone: true,
  providers: [DeviceApiService],
})
export class DeviceSocketComponent {
  @Input({ required: true }) device!: Device;

  constructor(
    private deviceApiService: DeviceApiService,
  ) { }

  getSwitch(device: Device): boolean {
    return getStatus(device, StatusCode.SWITCH);
  }

  toggleLight(device: Device): void {
    if (!device.online) return;

    const newValue = !this.getSwitch(device);
    this.deviceApiService.setDevice(
      device.id,
      [
        {
          code: StatusCode.SWITCH,
          value: newValue,
        },
      ],
    ).subscribe(() => {
      const index = getStatusIndex(device, StatusCode.SWITCH);
      if (index !== undefined) device.status[index].value = newValue;
    });
  }
}
