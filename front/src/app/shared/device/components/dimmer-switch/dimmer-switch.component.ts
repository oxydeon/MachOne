/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
import { Component, Input } from '@angular/core';
import { DeviceApiService } from '../../../api/services/device-api.service';
import { getStatus, getStatusIndex } from '../../utils/device.utils';
import { DimmerSwitchDevice, DimmerSwitchStatusCode } from '../../../api/models/dimmer-switch-device.model';
import { IsNotNullishPipe } from '../../../pipes/is-not-nullish.pipe';

interface Switch {
  statusCode: DimmerSwitchStatusCode;
  brightnessCode: DimmerSwitchStatusCode;
}

const Switches: Record<'SWITCH_1' | 'SWITCH_2' | 'SWITCH_3', Switch> = {
  SWITCH_1: {
    statusCode: DimmerSwitchStatusCode.SWITCH_LED_1,
    brightnessCode: DimmerSwitchStatusCode.BRIGHT_VALUE_1,
  },
  SWITCH_2: {
    statusCode: DimmerSwitchStatusCode.SWITCH_LED_2,
    brightnessCode: DimmerSwitchStatusCode.BRIGHT_VALUE_2,
  },
  SWITCH_3: {
    statusCode: DimmerSwitchStatusCode.SWITCH_LED_3,
    brightnessCode: DimmerSwitchStatusCode.BRIGHT_VALUE_3,
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

  Switches = Switches;

  constructor(
    private deviceApiService: DeviceApiService,
  ) { }

  switchState(dimmerSwitch: Switch): boolean {
    return getStatus(this.device, dimmerSwitch.statusCode);
  }

  switchBrightness(dimmerSwitch: Switch): number {
    return getStatus(this.device, dimmerSwitch.brightnessCode);
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
