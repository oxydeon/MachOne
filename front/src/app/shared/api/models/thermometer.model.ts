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
    code: ThermometerStatusCode.BATTERY_PERCENTAGE;
    value: number;
  } |
  {
    code: ThermometerStatusCode.UNIT;
    value: ThermometerTemperatureUnit;
  };

// https://developer.tuya.com/en/docs/iot/s?id=K9gf48k1c0sgo
export enum ThermometerStatusCode {
  TEMPERATURE = 'va_temperature',
  HUMIDITY = 'va_humidity',
  BATTERY_STATE = 'battery_state',
  BATTERY_PERCENTAGE = 'battery_percentage',
  UNIT = 'temp_unit_convert',
}

export enum ThermometerBatteryState {
  LOW = 'low',
  MIDDLE = 'middle',
  HIGH = 'high',
}

export enum ThermometerTemperatureUnit {
  CELSIUS = 'c',
  FAHRENHEIT = 'f',
}
