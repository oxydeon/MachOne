import { Device } from './device.model';

export interface ThermometerDevice extends Device {
  status: ThermometerStatus[];
}

export type ThermometerStatus =
  {
    code: ThermometerStatusCode.TEMPERATURE
    | ThermometerStatusCode.HUMIDITY;
    value: number;
  } |
  {
    code: ThermometerStatusCode.BATTERY_STATE;
    value: ThermometerBatteryState;
  } |
  {
    code: ThermometerStatusCode.UNIT;
    value: string;
  };

// https://developer.tuya.com/en/docs/iot/s?id=K9gf48k1c0sgo
export enum ThermometerStatusCode {
  TEMPERATURE = 'va_thermometer',
  HUMIDITY = 'va_humidity',
  BATTERY_STATE = 'battery_state',
  UNIT = 'temp_unit_convert',
}

export enum ThermometerBatteryState {
  LOW = 'low',
  MIDDLE = 'middle',
  HIGH = 'high',
}
