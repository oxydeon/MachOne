import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../../../core/api/services/api.service';

@Injectable()
export class DeviceApiService {
  private endpoint = '/devices';

  constructor(
    private api: Api,
  ) { }

  getDevices(devices: string[]): Observable<any[]> {
    return this.api.get(
      this.endpoint,
      { devices: devices.join(',') },
    );
  }

  getDevice(deviceId: string): Observable<any> {
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
