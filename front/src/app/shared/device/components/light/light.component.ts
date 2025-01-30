/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';
import { DeviceApiService } from '../../../api/services/device-api.service';

@Component({
  selector: 'app-device-light',
  templateUrl: './light.component.html',
  styleUrls: [
    './light.component.scss',
    '../device.scss',
  ],
  standalone: true,
  providers: [DeviceApiService],
})
export class DeviceLightComponent {
  @Input() device: any;

  constructor(
    private deviceApiService: DeviceApiService,
  ) { }

  getLightStatus(device: any): boolean {
    return device.status?.[0]?.value;
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
}
