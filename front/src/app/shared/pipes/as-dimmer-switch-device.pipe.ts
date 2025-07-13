import { Pipe, PipeTransform } from '@angular/core';
import { Device } from '../api/models/device.model';
import { DimmerSwitchDevice } from '../api/models/dimmer-switch-device.model';

@Pipe({
  name: 'asDimmerSwitchDevice',
  pure: true,
  standalone: true,
})
export class AsDimmerSwitchDevicePipe implements PipeTransform {

  transform(device: Device): DimmerSwitchDevice {
    return device as DimmerSwitchDevice;
  }

}
