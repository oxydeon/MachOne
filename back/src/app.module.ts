/* eslint-disable @stylistic/array-element-newline */
import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DeviceApiService } from './shared/api/services/device-api.service';
import { TuyaApiService } from './shared/api/services/tuya-api.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
  ],
  providers: [
    Logger,
    TuyaApiService,
    DeviceApiService,
  ],
  controllers: [AppController],
})
export class AppModule { }
