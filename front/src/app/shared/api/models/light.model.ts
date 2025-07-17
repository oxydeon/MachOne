import { Device } from './device.model';

export interface LightDevice extends Device {
  status: {
    code: LightStatusCode;
    value: unknown;
  }[];
}

export enum LightStatusCode {
  SWITCH = 'switch_led',
}
