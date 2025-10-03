import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../../env';
import { loadingTime, mocks } from '../../../shared/api/mocks';
import { isValidParsedInteger } from '../../validation/utils/number';
import { HttpMethod } from '../models/mock.model';

@Injectable({ providedIn: 'root' })
export class Mock {

  hasMock(type: HttpMethod, endpoint: string): boolean {
    return environment.mock && !!this.searchMock(type, endpoint);
  }

  getMock<T>(type: HttpMethod, endpoint: string): Observable<T> {
    return of(this.searchMock<T>(type, endpoint)).pipe(
      delay(loadingTime * 1000), // fake loading
    );
  }

  private searchMock<T>(type: HttpMethod, endpoint: string): T {
    const urlElements = endpoint.split('/');
    const genericEndpoint = urlElements
      .reduce(
        (acc: string[], el) => {
          // replace id param with :id to always match the mock
          if (isValidParsedInteger(el)) {
            acc.push(':id');
          } else {
            acc.push(el);
          }

          return acc;
        },
        [],
      )
      .join('/');

    return mocks[genericEndpoint]?.[type] as T;
  }
}
