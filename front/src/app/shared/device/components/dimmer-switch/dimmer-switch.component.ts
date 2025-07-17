import { Component, Input } from '@angular/core';
import { IsNotNullishPipe } from '../../../../core/validation/pipes/is-not-nullish.pipe';
import { DimmerSwitchDevice, DimmerSwitchStatusCode } from '../../../api/models/dimmer-switch.model';
import { DeviceApiService } from '../../../api/services/device-api.service';
import { getStatus, getStatusIndex } from '../../utils/device.utils';

interface Switch {
  statusCode: DimmerSwitchStatusCode;
  brightnessCode: DimmerSwitchStatusCode;
  brightnessMax: DimmerSwitchStatusCode;
}

const switches: Record<'switch1' | 'switch2' | 'switch3', Switch> = {
  switch1: {
    statusCode: DimmerSwitchStatusCode.SWITCH_LED_1,
    brightnessCode: DimmerSwitchStatusCode.BRIGHT_VALUE_1,
    brightnessMax: DimmerSwitchStatusCode.BRIGHTNESS_MAX_1,
  },
  switch2: {
    statusCode: DimmerSwitchStatusCode.SWITCH_LED_2,
    brightnessCode: DimmerSwitchStatusCode.BRIGHT_VALUE_2,
    brightnessMax: DimmerSwitchStatusCode.BRIGHTNESS_MAX_2,
  },
  switch3: {
    statusCode: DimmerSwitchStatusCode.SWITCH_LED_3,
    brightnessCode: DimmerSwitchStatusCode.BRIGHT_VALUE_3,
    brightnessMax: DimmerSwitchStatusCode.BRIGHTNESS_MAX_3,
  },
};

@Component({
  selector: 'app-device-dimmer-switch',
  templateUrl: './dimmer-switch.component.html',
  styleUrls: [
    'dimmer-switch.component.scss',
    '../device.scss',
  ],
  standalone: true,
  providers: [DeviceApiService],
  imports: [IsNotNullishPipe],
})
export class DeviceDimmerSwitchComponent {
  @Input({ required: true }) device!: DimmerSwitchDevice;
  switches = switches;

  constructor(
    private deviceApiService: DeviceApiService,
  ) { }

  hasOnlyOneSwitch(): boolean {
    return this.device.online
      && this.switchState(switches.switch1)
      && !this.switchState(switches.switch2);
  }

  switchState(dimmerSwitch: Switch): boolean {
    return getStatus(this.device, dimmerSwitch.statusCode);
  }

  switchBrightness(dimmerSwitch: Switch): number {
    return getStatus(this.device, dimmerSwitch.brightnessCode);
  }

  brightnessPercentage(dimmerSwitch: Switch): number {
    return getStatus(this.device, dimmerSwitch.brightnessCode)
      / getStatus(this.device, dimmerSwitch.brightnessMax);
  }

  toggleLight(dimmerSwitch: Switch): void {
    if (!this.device.online) return;

    const newValue = !this.switchState(dimmerSwitch);
    this.deviceApiService.setDevice(
      this.device.id,
      [
        {
          code: dimmerSwitch.statusCode,
          value: newValue,
        },
      ],
    ).subscribe(() => {
      const index = getStatusIndex(this.device, dimmerSwitch.statusCode);
      if (index !== undefined) this.device.status[index].value = newValue;
    });
  }

  changeBrightness(dimmerSwitch: Switch, brightnessValue: number): void {
    if (!this.device.online) return;

    this.deviceApiService.setDevice(
      this.device.id,
      [
        {
          code: dimmerSwitch.brightnessCode,
          value: brightnessValue,
        },
      ],
    ).subscribe(() => {
      const index = getStatusIndex(this.device, dimmerSwitch.brightnessCode);
      if (index !== undefined) this.device.status[index].value = brightnessValue;
    });
  }
}
