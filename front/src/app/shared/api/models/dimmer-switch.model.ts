import { Device } from './device.model';

export interface DimmerSwitchDevice extends Device {
  status: DimmerSwitchStatus[];
}

export type DimmerSwitchStatus =
  {
    code: DimmerSwitchStatusCode.SWITCH_LED_1 | DimmerSwitchStatusCode.SWITCH_LED_2;
    value: boolean;
  } |
  {
    code: DimmerSwitchStatusCode.BRIGHT_VALUE_1
    | DimmerSwitchStatusCode.BRIGHTNESS_MIN_1
    | DimmerSwitchStatusCode.BRIGHTNESS_MAX_1
    | DimmerSwitchStatusCode.COUNTDOWN_1
    | DimmerSwitchStatusCode.BRIGHT_VALUE_2
    | DimmerSwitchStatusCode.BRIGHTNESS_MIN_2
    | DimmerSwitchStatusCode.BRIGHTNESS_MAX_2
    | DimmerSwitchStatusCode.COUNTDOWN_2;
    value: number;
  } |
  {
    code: DimmerSwitchStatusCode.RELAY_STATUS;
    value: 'on' | 'off' | 'memory';
  } |
  {
    code: DimmerSwitchStatusCode.LIGHT_MODE;
    value: 'relay' | 'pos';
  };

// https://developer.tuya.com/en/docs/iot/s?id=K9t2a5mn56bdr
export enum DimmerSwitchStatusCode {
  SWITCH_LED_1 = 'switch_led_1',
  BRIGHT_VALUE_1 = 'bright_value_1',
  BRIGHTNESS_MIN_1 = 'brightness_min_1',
  BRIGHTNESS_MAX_1 = 'brightness_max_1',
  COUNTDOWN_1 = 'countdown_1',

  SWITCH_LED_2 = 'switch_led_2',
  BRIGHT_VALUE_2 = 'bright_value_2',
  BRIGHTNESS_MIN_2 = 'brightness_min_2',
  BRIGHTNESS_MAX_2 = 'brightness_max_2',
  COUNTDOWN_2 = 'countdown_2',

  SWITCH_LED_3 = 'switch_led_3',
  BRIGHT_VALUE_3 = 'bright_value_3',
  BRIGHTNESS_MIN_3 = 'brightness_min_3',
  BRIGHTNESS_MAX_3 = 'brightness_max_3',
  COUNTDOWN_3 = 'countdown_3',

  RELAY_STATUS = 'relay_status',
  LIGHT_MODE = 'light_mode',
}
