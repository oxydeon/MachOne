import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { devicesList } from './config';
import { Api } from './core/api/services/api.service';
import { CoreModule } from './core/core.module';
import { DeviceApiService } from './shared/api/services/device-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [CoreModule],
  providers: [DeviceApiService],
})
export class AppComponent implements OnInit {
  devices: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: Api,
    private deviceApiService: DeviceApiService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      map((params) => {
        this.api.auth(params['appKey'], params['secretKey']);
        return params;
      }),
      filter((params) => !!params['appKey']),
      switchMap(() => this.deviceApiService.getDevices(Object.values(devicesList))),
    ).subscribe((devices) => {
      const devicesOrder = Object.keys(devicesList);
      this.devices = devices.sort(
        (a, b) => devicesOrder.indexOf(a.name) - devicesOrder.indexOf(b.name),
      );
    });
  }
}
