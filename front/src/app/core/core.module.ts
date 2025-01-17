import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from './api/services/api.service';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
  ],
  providers: [Api],
})
export class CoreModule { }
