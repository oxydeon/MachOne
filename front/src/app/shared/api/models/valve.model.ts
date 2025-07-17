import { Device } from './device.model';

export interface ValveDevice extends Device {
  status: {
    code: ValveStatusCode;
    value: unknown;
  }[];
}

export enum ValveStatusCode {
  MODE = 'mode',
  STATE = 'work_state',
  TEMPERATURE_SET = 'temp_set',
  TEMPERATURE = 'temp_current',
}
