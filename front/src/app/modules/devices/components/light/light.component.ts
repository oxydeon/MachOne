import { Component, Input } from '@angular/core';
import { LightDevice, LightStatusCode } from '../../../../shared/api/models/light.model';
import { DeviceApiService } from '../../../../shared/api/services/device-api.service';
import { getStatus, getStatusIndex } from '../../utils/device.utils';

@Component({
  selector: 'app-device-light',
  templateUrl: '../socket/socket.component.html',
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

  get switch(): boolean {
    return getStatus(this.device, LightStatusCode.SWITCH);
  }

  toggleLight(): void {
    if (!this.device.online) return;

    const newValue = !this.switch;
    this.deviceApiService.setDevice(
      this.device.id,
      [
        {
          code: LightStatusCode.SWITCH,
          value: newValue,
        },
      ],
    ).subscribe(() => {
      const index = getStatusIndex(this.device, LightStatusCode.SWITCH);
      if (index !== undefined) this.device.status[index].value = newValue;
    });
  }
}
