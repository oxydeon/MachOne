import { Injectable } from '@angular/core';

@Injectable()
export class VibrationService {
  vibrate(pattern: number | number[]): void {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }
}
