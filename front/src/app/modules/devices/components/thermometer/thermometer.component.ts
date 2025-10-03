import { Component, Input } from '@angular/core';
import { ThermometerBatteryState, ThermometerDevice, ThermometerStatusCode, ThermometerTemperatureUnit } from '../../../../shared/api/models/thermometer.model';
import { DeviceApiService } from '../../../../shared/api/services/device-api.service';
import { getStatus } from '../../utils/device.utils';
import { deviceValues } from './config';

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
    const temperature = (getStatus(this.device, ThermometerStatusCode.TEMPERATURE) ?? 0) / 10;

    return this.tempUnitConvert === ThermometerTemperatureUnit.FAHRENHEIT
      ? this.convertCelsiusToFahrenheit(temperature)
      : temperature;
  }

  get humidity(): number {
    return getStatus(this.device, ThermometerStatusCode.HUMIDITY);
  }

  get batteryState(): ThermometerBatteryState {
    const batteryState = getStatus(this.device, ThermometerStatusCode.BATTERY_STATE);
    if (batteryState) return batteryState;

    const batteryPercentage: number = getStatus(this.device, ThermometerStatusCode.BATTERY_PERCENTAGE);
    if (batteryPercentage < deviceValues.battery.low) return ThermometerBatteryState.LOW;
    if (batteryPercentage < deviceValues.battery.middle) return ThermometerBatteryState.MIDDLE;
    return ThermometerBatteryState.HIGH;
  }

  get tempUnitConvert(): string {
    return getStatus(this.device, ThermometerStatusCode.UNIT);
  }

  private convertCelsiusToFahrenheit(celsius: number): number {
    return (celsius * 9 / 5) + 32;
  }
}
