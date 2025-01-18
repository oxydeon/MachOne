import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

type QueryParam = string | number | boolean;

@Injectable()
export class Api {
  // private readonly baseUrl = 'localhost:3004';
  private readonly baseUrl = 'https://machone-back.onrender.com';
  private appKey = '';
  private secretKey = '';

  constructor(
    private http: HttpClient,
  ) { }

  auth(appKey: string, secretKey: string): void {
    this.appKey = appKey;
    this.secretKey = secretKey;
  }

  get<T>(
    endpoint: string,
    params?: { [key: string]: QueryParam },
  ): Observable<T> {
    return this.http.get<T>(
      `${this.baseUrl}${endpoint}`,
      this.getOptions(params),
    );
  }

  post<T>(
    endpoint: string,
    body?: { [key: string]: unknown },
    params?: { [key: string]: QueryParam },
  ): Observable<T> {
    return this.http.post<T>(
      `${this.baseUrl}${endpoint}`,
      body,
      this.getOptions(params),
    );
  }

  patch<T>(
    endpoint: string,
    body?: { [key: string]: unknown },
    params?: { [key: string]: QueryParam },
  ): Observable<T> {
    return this.http.patch<T>(
      `${this.baseUrl}${endpoint}`,
      body,
      this.getOptions(params),
    );
  }

  delete<T>(
    endpoint: string,
    params?: { [key: string]: QueryParam },
  ): Observable<T> {
    return this.http.delete<T>(
      `${this.baseUrl}${endpoint}`,
      this.getOptions(params),
    );
  }

  // get headers and params formatted
  private getOptions(
    queryParams: { [key: string]: QueryParam } = {},
  ): {
      headers: HttpHeaders;
      params: { [key: string]: QueryParam };
    } {
    // set query params
    const params = {
      ...queryParams,
      appKey: this.appKey,
      secretKey: this.secretKey,
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
