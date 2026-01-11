import { Injectable } from '@angular/core';

@Injectable()
export class VibrationService {
  vibrate(event: Event, pattern: number): void {
    if (!navigator.vibrate) return;
    if (!(event.target instanceof HTMLElement)) return;

    if (
      [
        'BUTTON',
        'A',
        'INPUT',
      ].includes(event.target.tagName)
      || event.target.closest('.cursor-pointer')
    ) {
      navigator.vibrate(pattern);
    }
  }
}
