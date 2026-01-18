import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../env';
import { Storage } from '../../storage/services/storage.service';
import { Body, Query } from '../models/api.model';
import { Mock } from './mock.service';

@Injectable()
export class Api {

  constructor(
    private http: HttpClient,
    private mock: Mock,
    private storage: Storage,
  ) { }

  get appKey(): string | undefined {
    return this.storage.get('appKey');
  }

  get secretKey(): string | undefined {
    return this.storage.get('secretKey');
  }

  set appKey(value: string | undefined) {
    this.storage.set('appKey', value);
  }
  set secretKey(value: string | undefined) {
    this.storage.set('secretKey', value);
  }

  hasAuth(): boolean {
    return !!this.appKey && !!this.secretKey;
  }

  auth(appKey: string, secretKey: string): void {
    this.appKey = appKey;
    this.secretKey = secretKey;
  }

  get<T>(
    endpoint: string,
    query?: Query,
  ): Observable<T> {
    if (!this.hasAuth()) return of();

    if (this.mock.hasMock('get', endpoint)) {
      return this.mock.getMock('get', endpoint);
    }

    return this.http.get<T>(
      `${environment.apiUrl}${endpoint}`,
      this.getOptions(query),
    );
  }

  post<T>(
    endpoint: string,
    body?: Body,
    query?: Query,
  ): Observable<T> {
    if (!this.hasAuth()) return of();

    if (this.mock.hasMock('post', endpoint)) {
      return this.mock.getMock('post', endpoint);
    }

    return this.http.post<T>(
      `${environment.apiUrl}${endpoint}`,
      body,
      this.getOptions(query),
    );
  }

  patch<T>(
    endpoint: string,
    body?: Body,
    query?: Query,
  ): Observable<T> {
    if (!this.hasAuth()) return of();

    if (this.mock.hasMock('patch', endpoint)) {
      return this.mock.getMock('patch', endpoint);
    }

    return this.http.patch<T>(
      `${environment.apiUrl}${endpoint}`,
      body,
      this.getOptions(query),
    );
  }

  delete<T>(
    endpoint: string,
    query?: Query,
  ): Observable<T> {
    if (!this.hasAuth()) return of();

    if (this.mock.hasMock('delete', endpoint)) {
      return this.mock.getMock('delete', endpoint);
    }

    return this.http.delete<T>(
      `${environment.apiUrl}${endpoint}`,
      this.getOptions(query),
    );
  }

  // get headers and params formatted
  private getOptions(
    query: Query = {},
  ): {
      headers: HttpHeaders;
      params: Query;
    } {
    // set query params
    const params = {
      ...query,
      appKey: this.appKey || '',
      secretKey: this.secretKey || '',
    };

    // set content type if not file upload
    const headers = new HttpHeaders()
      .append('Content-type', 'application/json');

    return {
      params,
      headers,
    };
  }
}
