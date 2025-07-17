import { Device } from './device.model';

export interface SocketDevice extends Device {
  status: {
    code: SocketStatusCode;
    value: unknown;
  }[];
}

export enum SocketStatusCode {
  SWITCH = 'switch_1',
}
