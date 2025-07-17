import { Device } from './device.model';

export interface TemperatureDevice extends Device {
  status: TemperatureStatus[];
}

export type TemperatureStatus =
  {
    code: TemperatureStatusCode.TEMPERATURE
    | TemperatureStatusCode.HUMIDITY;
    value: number;
  } |
  {
    code: TemperatureStatusCode.BATTERY_STATE;
    value: TemperatureBatteryState;
  } |
  {
    code: TemperatureStatusCode.UNIT;
    value: string;
  };

// https://developer.tuya.com/en/docs/iot/s?id=K9gf48k1c0sgo
export enum TemperatureStatusCode {
  TEMPERATURE = 'va_temperature',
  HUMIDITY = 'va_humidity',
  BATTERY_STATE = 'battery_state',
  UNIT = 'temp_unit_convert',
}

export enum TemperatureBatteryState {
  LOW = 'low',
  MIDDLE = 'middle',
  HIGH = 'high',
}
