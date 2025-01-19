/* eslint-disable @typescript-eslint/naming-convention */
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as qs from 'qs';

type QueryParam = string | number | boolean;

@Injectable()
export class TuyaApiService {
  private logger = new Logger(TuyaApiService.name);
  private readonly baseUrl: string = 'https://openapi.tuyaeu.com';

  constructor(
    private httpService: HttpService,
  ) { }

  async request<T>(
    appKey: string,
    secretKey: string,
    method: string,
    endPoint: string,
    query: { [k: string]: QueryParam } = {},
    body: { [k: string]: unknown } = {},
  ): Promise<T> {
    const headers = await this.getRequestSign(
      appKey,
      secretKey,
      method,
      endPoint,
      query,
      body,
    );

    const { data } = await this.httpService.axiosRef.request({
      method,
      url: this.baseUrl + endPoint,
      headers,
      params: query,
      data: body,
    });

    if (!data?.success) {
      this.logger.error(`${data.code} ${data.msg}`);
      throw new BadRequestException(`${data.msg}`);
    }

    return data.result;
  }

  private async getRequestSign(
    appKey: string,
    secretKey: string,
    method: string,
    endPoint: string,
    query: { [k: string]: QueryParam } = {},
    body: { [k: string]: unknown } = {},
  ): Promise<{ [k: string]: string }> {
    const token = await this.getToken(appKey, secretKey);

    const timestamp = Date.now().toString();
    const queryString = decodeURIComponent(qs.stringify(query));
    const url = queryString ? `${endPoint}?${queryString}` : endPoint;
    const contentHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(body))
      .digest('hex');
    const stringToSign = [
      method,
      contentHash,
      '',
      url,
    ].join('\n');
    const signString = appKey + token + timestamp + stringToSign;

    return {
      t: timestamp,
      sign_method: 'HMAC-SHA256',
      client_id: appKey,
      sign: this.encryptText(signString, secretKey),
      access_token: token,
    };
  }

  private async getToken(appKey: string, secretKey: string): Promise<string> {
    const method = 'GET';
    const timestamp = Date.now().toString();
    const endPoint = '/v1.0/token?grant_type=1';
    const contentHash = crypto
      .createHash('sha256')
      .update('')
      .digest('hex');
    const stringToSign = [
      method,
      contentHash,
      '',
      endPoint,
    ].join('\n');
    const signString = appKey + timestamp + stringToSign;

    const { data } = await this.httpService.axiosRef.get(
      `${this.baseUrl}/${endPoint}`,
      {
        headers: {
          t: timestamp,
          sign_method: 'HMAC-SHA256',
          client_id: appKey,
          sign: this.encryptText(signString, secretKey),
        },
      },
    );

    if (!data?.success || !data?.result?.access_token) {
      this.logger.error(`${data.code} ${data.msg}`);
      throw new UnauthorizedException(`${data.msg}`);
    }
    return data.result?.access_token;
  }

  private encryptText(text: string, secretKey: string): string {
    return crypto
      .createHmac('sha256', secretKey)
      .update(text, 'utf8')
      .digest('hex')
      .toUpperCase();
  }
}
