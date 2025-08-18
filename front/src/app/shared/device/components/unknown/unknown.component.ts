/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';
import { Device } from '../../../api/models/device.model';

@Component({
  selector: 'app-device-unknown',
  templateUrl: './unknown.component.html',
  styleUrls: [
    './unknown.component.scss',
    '../device.scss',
  ],
  standalone: true,
})
export class DeviceUnknownComponent {
  @Input({ required: true }) device!: Device;
}
