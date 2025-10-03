import { Component, Input } from '@angular/core';
import { Api } from '../../../../core/api/services/api.service';
import { CoreModule } from '../../../../core/core.module';
import { ErrorModel } from '../../../../core/api/models/error.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  standalone: true,
  providers: [Api],
  imports: [CoreModule],
})
export class MessageComponent {
  @Input() hasData?: boolean;
  @Input() error?: ErrorModel;

  baseUrl = window.location.origin;

  constructor(
    public api: Api,
  ) { }
}
