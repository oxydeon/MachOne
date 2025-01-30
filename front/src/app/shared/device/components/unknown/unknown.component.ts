/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-device-unknown',
  templateUrl: './unknown.component.html',
  styleUrls: [
    './unknown.component.scss',
    '../device.scss',
  ],
  standalone: true,
})
export class DeviceUnknowComponent {
  @Input() device: any;
}
