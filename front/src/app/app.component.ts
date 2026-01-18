import { Component, DestroyRef, HostListener, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Api } from './core/api/services/api.service';
import { CoreModule } from './core/core.module';
import { VibrationService } from './core/services/vibration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  providers: [VibrationService],
  imports: [CoreModule],
})
export class AppComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private api: Api,
    private vibrationService: VibrationService,
  ) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.vibrationService.vibrate(event, 50);
  }

  ngOnInit(): void {
    // retrieve credentials from query params
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ appKey, secretKey }) => {
        if (appKey && secretKey) {
          this.api.auth(appKey, secretKey);
        }
      });
  }
}
