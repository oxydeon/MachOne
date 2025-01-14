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

  @Post('/:deviceId')
  async setDevice(
    @Param('deviceId') deviceId: string,
    @Query() query: {
      appKey: string;
      secretKey: string;
    },
    @Body() commands: {
      code: string;
      value: unknown;
    }[],
  ): Promise<void> {
    return this.deviceApiService.setDevice(
      query.appKey,
      query.secretKey,
      deviceId,
      commands,
    );
  }
}
