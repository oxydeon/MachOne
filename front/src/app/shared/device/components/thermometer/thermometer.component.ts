import { Component, Input } from '@angular/core';
import { ThermometerBatteryState, ThermometerDevice, ThermometerStatusCode } from '../../../api/models/thermometer.model';
import { DeviceApiService } from '../../../api/services/device-api.service';
import { getStatus } from '../../utils/device.utils';

@Component({
  selector: 'app-device-thermometer',
  templateUrl: './thermometer.component.html',
  styleUrls: [
    './thermometer.component.scss',
    '../device.scss',
  ],
  standalone: true,
  providers: [DeviceApiService],
})
export class DeviceThermometerComponent {
  @Input({ required: true }) device!: ThermometerDevice;
  thermometerBatteryState = ThermometerBatteryState;

  get temperature(): number {
    return (getStatus(this.device, ThermometerStatusCode.TEMPERATURE) ?? 0) / 10;
  }

  get humidity(): number {
    return getStatus(this.device, ThermometerStatusCode.HUMIDITY);
  }

  get batteryState(): string {
    return getStatus(this.device, ThermometerStatusCode.BATTERY_STATE);
  }

  get tempUnitConvert(): string {
    return getStatus(this.device, ThermometerStatusCode.UNIT);
  }
}
