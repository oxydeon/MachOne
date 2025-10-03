import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Api } from './api/services/api.service';

@NgModule({
  providers: [
    Api,
    Storage,
  ],
  exports: [
    CommonModule,
    RouterModule,
  ],
})
export class CoreModule { }
