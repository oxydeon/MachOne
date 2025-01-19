/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-device-unknown',
  templateUrl: './unknown.component.html',
  styleUrls: [
    '../device.scss',
    './unknown.component.scss',
  ],
  standalone: true,
})
export class DeviceUnknowComponent {
  @Input() device: any;
}
