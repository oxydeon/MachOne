/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Logger } from '@nestjs/common';
import { Device } from '../models/device.model';
import { TuyaApiService } from './tuya-api.service';

@Injectable()
export class DeviceApiService {
  private logger = new Logger(DeviceApiService.name);

  // Avoid limitation of API
  private maxDevicesListSize = 20;
  private maxDeviceLogsSize = 30;

  constructor(
    private tuyaApiService: TuyaApiService,
  ) { }

  async getAllDevices(
    appKey: string,
    secretKey: string,
  ): Promise<Device[]> {
    return this.tuyaApiService.request<any>(
      appKey,
      secretKey,
      'GET',
      '/v2.0/cloud/thing/device',
      { page_size: this.maxDevicesListSize },
    );
  }

  async getDevices(
    appKey: string,
    secretKey: string,
    devices?: string[],
  ): Promise<Device[]> {
    let deviceIds = devices;

    // If no devices specified, retrieve all devices
    if (!devices?.length) {
      const allDevices = await this.getAllDevices(appKey, secretKey);
      deviceIds = allDevices.map((device) => device.id);
    }

    this.logger.debug(`${this.formatContext(appKey)} GET ${deviceIds.length} devices`);

    const result = await this.tuyaApiService.request<any>(
      appKey,
      secretKey,
      'GET',
      '/v1.0/devices',
      { device_ids: deviceIds.join(',') },
    );

    return result.devices;
  }

  async getDevice(
    appKey: string,
    secretKey: string,
    deviceId: string,
  ): Promise<Device> {
    return this.tuyaApiService.request(
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
  ): Promise<object[]> {
    const logs: object[] = [];

    const params = {
      start_time: search.startTime.getTime(),
      end_time: search.endTime.getTime(),
      codes: search.codes?.join(','),
      type: 7, // EVENT_TYPE_REPORT
    };

    let pagination = 1;
    let hasNext = true;
    let nextRowKey: string | undefined;

    while (hasNext) {
      this.logger.debug(`${this.formatContext(appKey)} GET devices logs page ${pagination}`);

      // eslint-disable-next-line no-await-in-loop
      const result = await this.tuyaApiService.request<any>(
        appKey,
        secretKey,
        'GET',
        `/v1.0/devices/${deviceId}/logs`,
        {
          ...params,
          start_row_key: nextRowKey,
        },
      );

      pagination += 1;
      hasNext = result.has_next;
      nextRowKey = result.next_row_key;

      // merge logs
      logs.push(...result.logs);

      if (pagination > this.maxDeviceLogsSize) {
        this.logger.warn(`${this.formatContext(appKey)} GET devices logs exceeded max pagination limit`);
        break;
      }
    }

    // Return logs in chronological order
    return logs.reverse();
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

  private formatContext(appKey: string): string {
    return `[AppKey ***${appKey.slice(-4)}]`;
  }
}
