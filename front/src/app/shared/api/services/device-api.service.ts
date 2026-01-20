import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../../../core/api/services/api.service';
import { Device } from '../models/device.model';

@Injectable()
export class DeviceApiService {
  private endpoint = '/devices';

  constructor(
    private api: Api,
  ) { }

  getDevices(devices: string[]): Observable<Device[]> {
    return this.api.get(
      this.endpoint,
      devices.length ? { devices: devices.join(',') } : {},
    );
  }

  getDevice(deviceId: string): Observable<Device> {
    return this.api.get(`${this.endpoint}/${deviceId}`);
  }

  setDevice(
    deviceId: string,
    commands: {
      code: string;
      value: unknown;
    }[],
  ): Observable<void> {
    return this.api.post<void>(
      `${this.endpoint}/${deviceId}`,
      commands,
    );
  }
}
