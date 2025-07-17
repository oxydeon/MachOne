import { Device } from './device.model';

export interface ValveDevice extends Device {
  status: ValveStatus[];
}

export type ValveStatus =
  {
    code: ValveStatusCode.MODE;
    value: ValveMode;
  } |
  {
    code: ValveStatusCode.STATE;
    value: ValveState;
  } |
  {
    code: ValveStatusCode;
    value: unknown;
  };

export enum ValveStatusCode {
  MODE = 'mode',
  STATE = 'work_state',
  TEMPERATURE_SET = 'temp_set',
  TEMPERATURE = 'temp_current',
}

export enum ValveMode {
  OFF = 'off',
  AUTO = 'auto',
  MANUAL = 'manual',
}

export enum ValveState {
  OPEN = 'opened',
  CLOSE = 'closed',
}
