import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../env';
import { Body, Query } from '../models/api.model';
import { Mock } from './mock.service';

@Injectable()
export class Api {
  private appKey?: string;
  private secretKey?: string;

  constructor(
    private http: HttpClient,
    private mock: Mock,
  ) { }

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
