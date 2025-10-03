import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import { environment } from '../../../../../env';
import { ErrorModel } from '../../../../core/api/models/error.model';
import { CoreModule } from '../../../../core/core.module';
import { Device } from '../../../../shared/api/models/device.model';
import { DimmerSwitchDevice } from '../../../../shared/api/models/dimmer-switch.model';
import { LightDevice } from '../../../../shared/api/models/light.model';
import { SocketDevice } from '../../../../shared/api/models/socket.model';
import { ThermometerDevice } from '../../../../shared/api/models/thermometer.model';
import { ValveDevice } from '../../../../shared/api/models/valve.model';
import { DeviceApiService } from '../../../../shared/api/services/device-api.service';
import { DeviceDimmerSwitchComponent } from '../../components/dimmer-switch/dimmer-switch.component';
import { DeviceLightComponent } from '../../components/light/light.component';
import { MessageComponent } from '../../components/message/message.component';
import { DeviceSocketComponent } from '../../components/socket/socket.component';
import { DeviceThermometerComponent } from '../../components/thermometer/thermometer.component';
import { DeviceUnknownComponent } from '../../components/unknown/unknown.component';
import { DeviceValveComponent } from '../../components/valve/valve.component';
import { deviceTypes } from '../../config';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  standalone: true,
  providers: [DeviceApiService],
  imports: [
    CoreModule,
    MessageComponent,
    DeviceUnknownComponent,
    DeviceSocketComponent,
    DeviceLightComponent,
    DeviceValveComponent,
    DeviceThermometerComponent,
    DeviceDimmerSwitchComponent,
  ],
})
export class DevicesComponent implements OnInit {
  devicesIds: string[] = [];
  lineBreaks: number[] = [];
  devices?: Device[];
  error?: ErrorModel;
  errorCount = 0;

  constructor(
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private deviceApiService: DeviceApiService,
  ) { }

  ngOnInit(): void {
    // retrieve credentials from query params
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ devices, lineBreaks }) => {
        this.devicesIds = devices ? devices.split(',') : [];
        this.lineBreaks = lineBreaks ? lineBreaks.split(',').map(Number) : [];

        this.retrieveDevices();

        setInterval(
          () => this.retrieveDevices(),
          environment.devicesRefreshDelay * 60 * 1000,
        );
      });
  }

  retrieveDevices(): void {
    if (this.errorCount >= environment.retryCount) return;

    this.deviceApiService.getDevices(this.devicesIds)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((e: HttpErrorResponse) => {
          this.error = e.error;
          this.errorCount += 1;
          return of();
        }),
      )
      .subscribe((devices) => {
        // clear error
        this.error = undefined;
        this.errorCount = 0;

        // order devices
        this.devices = devices.sort(
          (a, b) => this.devicesIds.indexOf(a.id) - this.devicesIds.indexOf(b.id),
        );
      });
  }

  isSocketDevice(device: Device): device is SocketDevice {
    return deviceTypes.socket.includes(device.category);
  }

  isLightDevice(device: Device): device is LightDevice {
    return deviceTypes.light.includes(device.category);
  }

  isValveDevice(device: Device): device is ValveDevice {
    return deviceTypes.valve.includes(device.category);
  }

  isThermometerDevice(device: Device): device is ThermometerDevice {
    return deviceTypes.thermometer.includes(device.category);
  }

  isDimmerSwitchDevice(device: Device): device is DimmerSwitchDevice {
    return deviceTypes.dimmerSwitch.includes(device.category);
  }
}
