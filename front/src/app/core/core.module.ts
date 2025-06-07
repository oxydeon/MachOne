import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Api } from './api/services/api.service';

@NgModule({
  exports: [CommonModule],
  providers: [Api],
})
export class CoreModule { }
