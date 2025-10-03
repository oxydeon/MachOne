/* eslint-disable @stylistic/object-curly-newline */
/* eslint-disable @typescript-eslint/naming-convention */
import { MockConfig } from '../../core/api/models/mock.model';
import { deviceLogs } from './mocks/device-logs';
import { devices } from './mocks/devices';

export const loadingTime = 0.3; // seconds

export const mocks: MockConfig = {
  '/devices': { get: devices },
  '/devices/:id': {
    get: devices[0],
    post: {},
  },
  '/devices/:id/logs': {
    get: deviceLogs,
  },
};
