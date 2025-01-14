/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@nestjs/common';
import { TuyaApiService } from './tuya-api.service';

@Injectable()
export class DeviceApiService {

  constructor(
    private tuyaApiService: TuyaApiService,
  ) { }

  async getDevices(
    appKey: string,
    secretKey: string,
    devices: string[],
  ): Promise<object> {
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
