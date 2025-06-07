/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Device {
  id: string;
  name: string;
  category: string;
  online: boolean;
  status: {
    code: StatusCode;
    value: any;
  }[];
}

export enum StatusCode {
  MODE = 'mode',
  STATE = 'work_state',
  TEMPERATURE_SET = 'temp_set',
  TEMPERATURE = 'temp_current',
  SWITCH = 'switch_1',
  SWITCH_LIGHT = 'switch_led',
}
