import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError } from 'rxjs';
import { environment } from '../env';
import { deviceTypes } from './config';
import { Api } from './core/api/services/api.service';
import { CoreModule } from './core/core.module';
import { VibrationService } from './core/services/vibration.service';
import { Device } from './shared/api/models/device.model';
import { DimmerSwitchDevice } from './shared/api/models/dimmer-switch.model';
import { LightDevice } from './shared/api/models/light.model';
import { SocketDevice } from './shared/api/models/socket.model';
import { ThermometerDevice } from './shared/api/models/thermometer.model';
import { ValveDevice } from './shared/api/models/valve.model';
import { DeviceApiService } from './shared/api/services/device-api.service';
import { DeviceDimmerSwitchComponent } from './shared/device/components/dimmer-switch/dimmer-switch.component';
import { DeviceLightComponent } from './shared/device/components/light/light.component';
import { DeviceSocketComponent } from './shared/device/components/socket/socket.component';
import { DeviceThermometerComponent } from './shared/device/components/thermometer/thermometer.component';
import { DeviceUnknownComponent } from './shared/device/components/unknown/unknown.component';
import { DeviceValveComponent } from './shared/device/components/valve/valve.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  providers: [
    Api,
    DeviceApiService,
    VibrationService,
  ],
  imports: [
    CoreModule,
    RouterModule,
    DeviceUnknownComponent,
    DeviceSocketComponent,
    DeviceLightComponent,
    DeviceValveComponent,
    DeviceThermometerComponent,
    DeviceDimmerSwitchComponent,
  ],
})
export class AppComponent implements OnInit {
  baseUrl = window.location.origin;
  deviceTypes = deviceTypes;

  devicesIds: string[] = [];
  lineBreaks: number[] = [];
  devices?: Device[];
  errorMessage?: string;
  errorCount = 0;

  constructor(
    private route: ActivatedRoute,
    public api: Api,
    private deviceApiService: DeviceApiService,
    private vibrationService: VibrationService,
  ) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    this.vibrationService.vibrate(50);
  }

  ngOnInit(): void {
    // retrieve credentials from query params
    this.route.queryParams.subscribe(({ appKey, secretKey, devices, lineBreaks }) => {
      if (!appKey || !secretKey || !devices) return;

      this.api.auth(appKey, secretKey);
      this.devicesIds = devices.split(',');
      this.lineBreaks = lineBreaks ? lineBreaks.split(',').map(Number) : [];

      this.retrieveDevices();

      setInterval(
        () => this.retrieveDevices(),
        environment.refreshDelay * 1000,
      );
    });
  }

  retrieveDevices(): void {
    if (this.errorCount >= environment.retryCount) return;

    this.deviceApiService.getDevices(this.devicesIds)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          const { error, message } = e.error;
          this.errorMessage = error && message ? `${error} - ${message}` : 'An error occurred';
          this.errorCount += 1;

          return [];
        }),
      )
      .subscribe((devices) => {
        // clear error
        this.errorMessage = undefined;
        this.errorCount = 0;

        // order devices
        this.devices = devices.sort(
          (a, b) => this.devicesIds.indexOf(a.id) - this.devicesIds.indexOf(b.id),
        );
      });
  }

  isSocketDevice(device: Device): device is SocketDevice {
    return this.deviceTypes.socket.includes(device.category);
  }

  isLightDevice(device: Device): device is LightDevice {
    return this.deviceTypes.light.includes(device.category);
  }

  isValveDevice(device: Device): device is ValveDevice {
    return this.deviceTypes.valve.includes(device.category);
  }

  isThermometerDevice(device: Device): device is ThermometerDevice {
    return this.deviceTypes.thermometer.includes(device.category);
  }

  isDimmerSwitchDevice(device: Device): device is DimmerSwitchDevice {
    return this.deviceTypes.dimmerSwitch.includes(device.category);
  }
}
