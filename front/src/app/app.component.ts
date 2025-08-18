import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError } from 'rxjs';
import { environment } from '../env';
import { deviceTypes } from './config';
import { Api } from './core/api/services/api.service';
import { CoreModule } from './core/core.module';
import { Device } from './shared/api/models/device.model';
import { DeviceApiService } from './shared/api/services/device-api.service';
import { DeviceLightComponent } from './shared/device/components/light/light.component';
import { DeviceSocketComponent } from './shared/device/components/socket/socket.component';
import { DeviceUnknowComponent } from './shared/device/components/unknown/unknown.component';
import { DeviceValveComponent } from './shared/device/components/valve/valve.component';
import { DeviceTemperatureComponent } from './shared/device/components/temperature/temperature.component';
import { AsTemperatureDevicePipe } from './shared/pipes/as-temperature-device.pipe';
import { DeviceDimmerSwitchComponent } from './shared/device/components/dimmer-switch/dimmer-switch.component';
import { AsDimmerSwitchDevicePipe } from './shared/pipes/as-dimmer-switch-device.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  providers: [
    Api,
    DeviceApiService,
  ],
  imports: [
    CoreModule,
    RouterModule,
    DeviceUnknowComponent,
    DeviceSocketComponent,
    DeviceLightComponent,
    DeviceValveComponent,
    DeviceTemperatureComponent,
    AsTemperatureDevicePipe,
    DeviceDimmerSwitchComponent,
    AsDimmerSwitchDevicePipe,
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
  ) { }

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
}
