import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/devices/pages/devices/devices.component')
      .then((m) => m.DevicesComponent),
  },
  {
    path: 'valve/:id',
    loadComponent: () => import('./modules/devices/pages/valve/valve.component')
      .then((m) => m.ValveComponent),
  },
];
