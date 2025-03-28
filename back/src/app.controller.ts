import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DeviceApiService } from './shared/api/services/device-api.service';

@Controller('/devices')
export class AppController {

  constructor(
    private deviceApiService: DeviceApiService,
  ) { }

  @Get()
  async getDevices(
    @Query() query: {
      appKey: string;
      secretKey: string;
      devices: string;
    },
  ): Promise<object> {
    return this.deviceApiService.getDevices(
      query.appKey,
      query.secretKey,
      query.devices.split(','),
    );
  }

  @Get('/:deviceId')
  async getDevice(
    @Param('deviceId') deviceId: string,
    @Query() query: {
      appKey: string;
      secretKey: string;
    },
  ): Promise<object> {
    return this.deviceApiService.getDevice(
      query.appKey,
      query.secretKey,
      deviceId,
    );
  }

  @Get('/:deviceId/logs')
  async getDeviceLogs(
    @Param('deviceId') deviceId: string,
    @Query() query: {
      appKey: string;
      secretKey: string;
      startTime: string;
      endTime: string;
      codes?: string;
    },
  ): Promise<object> {
    return this.deviceApiService.getDeviceLogs(
      query.appKey,
      query.secretKey,
      deviceId,
      {
        startTime: new Date(query.startTime),
        endTime: new Date(query.endTime),
        codes: query.codes?.split(','),
      },
    );
  }

  @Post('/:deviceId')
  async setDevice(
    @Param('deviceId') deviceId: string,
    @Query() query: {
      appKey: string;
      secretKey: string;
    },
    @Body() body: {
      code: string;
      value: unknown;
    }[],
  ): Promise<void> {
    return this.deviceApiService.setDevice(
      query.appKey,
      query.secretKey,
      deviceId,
      body,
    );
  }
}
