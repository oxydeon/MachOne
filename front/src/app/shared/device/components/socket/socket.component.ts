/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';
import { SocketDevice, SocketStatusCode } from '../../../api/models/socket.model';
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
  @Input({ required: true }) device!: SocketDevice;

  constructor(
    private deviceApiService: DeviceApiService,
  ) { }

  get switch(): boolean {
    return getStatus(this.device, SocketStatusCode.SWITCH);
  }

  toggleLight(): void {
    if (!this.device.online) return;

    const newValue = !this.switch;
    this.deviceApiService.setDevice(
      this.device.id,
      [
        {
          code: SocketStatusCode.SWITCH,
          value: newValue,
        },
      ],
    ).subscribe(() => {
      const index = getStatusIndex(this.device, SocketStatusCode.SWITCH);
      if (index !== undefined) this.device.status[index].value = newValue;
    });
  }
}
