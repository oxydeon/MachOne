import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Api } from './api/services/api.service';

@NgModule({
  exports: [
    CommonModule,
    RouterModule,
  ],
  providers: [Api],
})
export class CoreModule { }
