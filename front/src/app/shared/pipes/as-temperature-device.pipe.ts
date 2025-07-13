import { Pipe, PipeTransform } from '@angular/core';
import { TemperatureDevice } from '../api/models/temperature-device.model';
import { Device } from '../api/models/device.model';

@Pipe({
  name: 'asTemperatureDevice',
  pure: true,
  standalone: true,
})
export class AsTemperatureDevicePipe implements PipeTransform {

  transform(device: Device): TemperatureDevice {
    return device as TemperatureDevice;
  }

}
