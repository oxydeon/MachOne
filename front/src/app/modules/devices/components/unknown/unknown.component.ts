import { Component, Input } from '@angular/core';
import { Device } from '../../../../shared/api/models/device.model';

@Component({
  selector: 'app-device-unknown',
  templateUrl: './unknown.component.html',
  styleUrls: ['../device.scss'],
  standalone: true,
})
export class DeviceUnknownComponent {
  @Input({ required: true }) device!: Device;
}
