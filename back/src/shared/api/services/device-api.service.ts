/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Logger } from '@nestjs/common';
import { TuyaApiService } from './tuya-api.service';

@Injectable()
export class DeviceApiService {
  private logger = new Logger(DeviceApiService.name);

  constructor(
    private tuyaApiService: TuyaApiService,
  ) { }

  async getDevices(
    appKey: string,
    secretKey: string,
    devices: string[],
  ): Promise<object> {
    this.logger.debug(`AppKey ***${appKey.slice(-4)} get ${devices.length} devices`);

    const result = await this.tuyaApiService.request<any>(
      appKey,
      secretKey,
      'GET',
      '/v1.0/devices',
      { device_ids: devices.join(',') },
    );

    return result.devices;
  }

  async getDevice(
    appKey: string,
    secretKey: string,
    deviceId: string,
  ): Promise<object> {
    return this.tuyaApiService.request<any>(
      appKey,
      secretKey,
      'GET',
      `/v1.0/devices/${deviceId}`,
    );
  }

  async getDeviceLogs(
    appKey: string,
    secretKey: string,
    deviceId: string,
    search: {
      startTime: Date;
      endTime: Date;
      codes?: string[];
    },
  ): Promise<object> {
    return this.tuyaApiService.request<any>(
      appKey,
      secretKey,
      'GET',
      `/v1.0/devices/${deviceId}/logs`,
      {
        start_time: search.startTime.getTime(),
        end_time: search.endTime.getTime(),
        codes: search.codes?.join(','),
        type: 7, // data point report
      },
    );
  }

  async setDevice(
    appKey: string,
    secretKey: string,
    deviceId: string,
    commands: {
      code: string;
      value: unknown;
    }[],
  ): Promise<void> {
    await this.tuyaApiService.request(
      appKey,
      secretKey,
      'POST',
      `/v1.0/devices/${deviceId}/commands`,
      {},
      { commands },
    );
  }
}
