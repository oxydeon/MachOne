/* eslint-disable max-lines */
import { Device } from '../models/device.model';

export const devices: Device[] = [
  {
    id: '000',
    category: 'wkf',
    name: 'Radiateur cuisine',
    online: true,
    status: [
      {
        code: 'mode',
        value: 'auto',
      },
      {
        code: 'work_state',
        value: 'closed',
      },
      {
        code: 'temp_set',
        value: 200,
      },
      {
        code: 'temp_current',
        value: 210,
      },
      {
        code: 'child_lock',
        value: false,
      },
    ],
  },
  {
    id: '000',
    category: 'wkf',
    name: 'Radiateur living',
    online: true,
    status: [
      {
        code: 'mode',
        value: 'auto',
      },
      {
        code: 'work_state',
        value: 'closed',
      },
      {
        code: 'temp_set',
        value: 200,
      },
      {
        code: 'temp_current',
        value: 210,
      },
      {
        code: 'child_lock',
        value: false,
      },
    ],
  },
  {
    id: '000',
    category: 'wkf',
    name: 'Radiateur salon',
    online: true,
    status: [
      {
        code: 'mode',
        value: 'auto',
      },
      {
        code: 'work_state',
        value: 'closed',
      },
      {
        code: 'temp_set',
        value: 200,
      },
      {
        code: 'temp_current',
        value: 210,
      },
      {
        code: 'child_lock',
        value: false,
      },
    ],
  },
  {
    id: '000',
    category: 'wkf',
    name: 'Radiateur bureau',
    online: true,
    status: [
      {
        code: 'mode',
        value: 'manual',
      },
      {
        code: 'work_state',
        value: 'closed',
      },
      {
        code: 'temp_set',
        value: 160,
      },
      {
        code: 'temp_current',
        value: 180,
      },
      {
        code: 'child_lock',
        value: false,
      },
    ],
  },
  {
    id: '000',
    category: 'wkf',
    name: 'Radiateur chambre',
    online: true,
    status: [
      {
        code: 'mode',
        value: 'manual',
      },
      {
        code: 'work_state',
        value: 'opened',
      },
      {
        code: 'temp_set',
        value: 200,
      },
      {
        code: 'temp_current',
        value: 180,
      },
      {
        code: 'child_lock',
        value: false,
      },
    ],
  },
  {
    id: '000',
    category: 'cz',
    name: 'Les loupiotes',
    online: true,
    status: [
      {
        code: 'switch_1',
        value: false,
      },
      {
        code: 'countdown_1',
        value: 0,
      },
      {
        code: 'relay_status',
        value: 'last',
      },
    ],
  },
  {
    id: '000',
    category: 'cz',
    name: 'L\'ampoule',
    online: true,
    status: [
      {
        code: 'switch_1',
        value: true,
      },
      {
        code: 'countdown_1',
        value: 0,
      },
      {
        code: 'relay_status',
        value: 'power_off',
      },
      {
        code: 'light_mode',
        value: 'relay',
      },
      {
        code: 'child_lock',
        value: false,
      },
      {
        code: 'cycle_time',
        value: '',
      },
      {
        code: 'random_time',
        value: '',
      },
      {
        code: 'switch_inching',
        value: '',
      },
    ],
  },
  {
    id: '000',
    category: 'cz',
    name: 'Le lampadaire',
    online: true,
    status: [
      {
        code: 'switch_1',
        value: false,
      },
      {
        code: 'countdown_1',
        value: 0,
      },
      {
        code: 'add_ele',
        value: 1,
      },
      {
        code: 'cur_current',
        value: 0,
      },
      {
        code: 'cur_power',
        value: 0,
      },
      {
        code: 'cur_voltage',
        value: 2374,
      },
      {
        code: 'relay_status',
        value: 'last',
      },
    ],
  },
  {
    id: '000',
    category: 'cz',
    name: 'L\'abat-jour',
    online: true,
    status: [
      {
        code: 'switch_1',
        value: false,
      },
      {
        code: 'countdown_1',
        value: 0,
      },
      {
        code: 'add_ele',
        value: 1,
      },
      {
        code: 'cur_current',
        value: 0,
      },
      {
        code: 'cur_power',
        value: 0,
      },
      {
        code: 'cur_voltage',
        value: 2401,
      },
      {
        code: 'relay_status',
        value: 'power_off',
      },
      {
        code: 'light_mode',
        value: 'relay',
      },
    ],
  },
  {
    id: '000',
    category: 'cz',
    name: 'Le vinyle',
    online: true,
    status: [
      {
        code: 'switch_1',
        value: true,
      },
      {
        code: 'countdown_1',
        value: 0,
      },
      {
        code: 'relay_status',
        value: 'last',
      },
    ],
  },
  {
    id: '000',
    category: 'cz',
    name: 'La guirlande',
    online: true,
    status: [
      {
        code: 'switch_1',
        value: false,
      },
      {
        code: 'countdown_1',
        value: 0,
      },
      {
        code: 'add_ele',
        value: 1,
      },
      {
        code: 'cur_current',
        value: 0,
      },
      {
        code: 'cur_power',
        value: 0,
      },
      {
        code: 'cur_voltage',
        value: 2393,
      },
    ],
  },
  {
    id: '000',
    category: 'cz',
    name: 'La lampe',
    online: false,
    status: [
      {
        code: 'switch_1',
        value: false,
      },
      {
        code: 'countdown_1',
        value: 0,
      },
    ],
  },
  {
    id: '000',
    category: 'tgkg',
    name: 'Dimmer living',
    online: true,
    status: [
      {
        code: 'switch_led_1',
        value: false,
      },
      {
        code: 'bright_value_1',
        value: 300,
      },
      {
        code: 'brightness_min_1',
        value: 10,
      },
      {
        code: 'brightness_max_1',
        value: 1000,
      },
      {
        code: 'switch_led_2',
        value: true,
      },
      {
        code: 'bright_value_2',
        value: 600,
      },
      {
        code: 'brightness_min_2',
        value: 10,
      },
      {
        code: 'brightness_max_2',
        value: 1000,
      },
    ],
  },
  {
    id: '000',
    category: 'tgkg',
    name: 'Dimmer hall',
    online: true,
    status: [
      {
        code: 'switch_led_1',
        value: true,
      },
      {
        code: 'bright_value_1',
        value: 320,
      },
      {
        code: 'brightness_min_1',
        value: 10,
      },
      {
        code: 'brightness_max_1',
        value: 1000,
      },
    ],
  },
  {
    id: '000',
    category: 'wsdcg',
    name: 'Thermomètre salon',
    online: true,
    status: [
      {
        code: 'va_temperature',
        value: 212,
      },
      {
        code: 'va_humidity',
        value: 46,
      },
      {
        code: 'battery_percentage',
        value: 53,
      },
      {
        code: 'temp_unit_convert',
        value: 'c',
      },
    ],
  },
];
