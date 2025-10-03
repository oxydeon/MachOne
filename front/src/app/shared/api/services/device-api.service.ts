import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Api } from '../../../core/api/services/api.service';
import { Device, DeviceLog, DeviceLogRaw } from '../models/device.model';

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

  getLogs(
    deviceId: string,
    query: {
      startTime: Date;
      endTime: Date;
      codes?: string[];
    },
  ): Observable<DeviceLog[]> {
    return this.api.get<DeviceLogRaw[]>(
      `${this.endpoint}/${deviceId}/logs`,
      {
        startTime: query.startTime.toISOString(),
        endTime: query.endTime.toISOString(),
        codes: query.codes?.join(',') || '',
      },
    ).pipe(
      map((deviceLogs) => deviceLogs.map(
        (log) => ({
          ...log,
          date: new Date(log.event_time),
        }),
      )),
    );
  }
}
