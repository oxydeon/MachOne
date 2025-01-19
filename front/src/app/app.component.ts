/* eslint-disable no-param-reassign */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError } from 'rxjs';
import { environment } from '../env';
import { deviceValues } from './config';
import { Api } from './core/api/services/api.service';
import { CoreModule } from './core/core.module';
import { DeviceApiService } from './shared/api/services/device-api.service';
import { DeviceLightComponent } from './shared/device/components/light/light.component';
import { DeviceUnknowComponent } from './shared/device/components/unknown/unknown.component';
import { DeviceValvetComponent } from './shared/device/components/valve/valve.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    CoreModule,
    RouterModule,
    DeviceUnknowComponent,
    DeviceLightComponent,
    DeviceValvetComponent,
  ],
  providers: [DeviceApiService],
})
export class AppComponent implements OnInit {
  baseUrl = window.location.origin;
  deviceValues = deviceValues;

  devicesIds: string[] = [];
  devices?: any[];
  errorMessage?: string;

  constructor(
    private route: ActivatedRoute,
    public api: Api,
    private deviceApiService: DeviceApiService,
  ) { }

  ngOnInit(): void {
    // retrieve credentials from query params
    this.route.queryParams.subscribe(({ appKey, secretKey, devices }) => {
      if (!appKey || !secretKey || !devices) return;

      this.api.auth(appKey, secretKey);
      this.devicesIds = devices.split(',');

      this.retrieveDevices();

      setInterval(
        () => this.retrieveDevices(),
        environment.refreshDelay * 1000,
      );
    });
  }

  retrieveDevices(): void {
    this.deviceApiService.getDevices(this.devicesIds)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          const { error, message } = e.error;
          this.errorMessage = error && message ? `${error} - ${message}` : 'An error occurred';
          return [];
        }),
      )
      .subscribe((devices) => {
        // order devices
        this.devices = devices.sort(
          (a, b) => this.devicesIds.indexOf(a.id) - this.devicesIds.indexOf(b.id),
        );
      });
  }
}
