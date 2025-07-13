/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';
import { DeviceApiService } from '../../../api/services/device-api.service';
import { TemperatureDevice, TemperatureDeviceBatteryState, TemperatureStatusCode } from '../../../api/models/temperature-device.model';
import { getStatus } from '../../utils/device.utils';

@Component({
  selector: 'app-device-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: [
    './temperature.component.scss',
    '../device.scss',
  ],
  standalone: true,
  providers: [DeviceApiService],
})
export class DeviceTemperatureComponent {
  @Input({ required: true }) device!: TemperatureDevice;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  TemperatureDeviceBatteryState = TemperatureDeviceBatteryState;

  get temperature(): number {
    return getStatus(this.device, TemperatureStatusCode.TEMPERATURE);
  }

  get humidity(): number {
    return getStatus(this.device, TemperatureStatusCode.HUMIDITY);
  }

  get batteryState(): string {
    return getStatus(this.device, TemperatureStatusCode.BATTERY_STATE);
  }

  get tempUnitConvert(): string {
    return getStatus(this.device, TemperatureStatusCode.TEMP_UNIT_CONVERT);
  }

}
