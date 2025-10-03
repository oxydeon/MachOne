import { Component, HostListener } from '@angular/core';
import { CoreModule } from './core/core.module';
import { VibrationService } from './core/services/vibration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  providers: [VibrationService],
  imports: [CoreModule],
})
export class AppComponent {

  constructor(
    private vibrationService: VibrationService,
  ) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    this.vibrationService.vibrate(50);
  }
}
