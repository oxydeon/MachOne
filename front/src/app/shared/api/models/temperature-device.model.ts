import { Device } from './device.model';

export type TemperatureStatus =
  {
    code: TemperatureStatusCode.TEMPERATURE | TemperatureStatusCode.HUMIDITY;
    value: number;
  }
  | {
    code: TemperatureStatusCode.BATTERY_STATE;
    value: TemperatureDeviceBatteryState;
  } | {
    code: TemperatureStatusCode.TEMP_UNIT_CONVERT;
    value: string;
  };

export interface TemperatureDevice extends Device {
  status: TemperatureStatus[];
}

// https://developer.tuya.com/en/docs/iot/s?id=K9gf48k1c0sgo
export enum TemperatureStatusCode {
  TEMPERATURE = 'va_temperature',
  HUMIDITY = 'va_humidity',
  BATTERY_STATE = 'battery_state',
  TEMP_UNIT_CONVERT = 'temp_unit_convert',
}

export enum TemperatureDeviceBatteryState {
  LOW = 'low',
  MIDDLE = 'middle',
  HIGH = 'high',
}
