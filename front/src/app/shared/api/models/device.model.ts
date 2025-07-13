/* eslint-disable @typescript-eslint/no-explicit-any */

// TODO: Use this only as a base interface, create more specific interfaces for different device types
export interface Device {
  id: string;
  name: string;
  category: string;
  online: boolean;
  status: {
    code: StatusCode | string;
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
