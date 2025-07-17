/* eslint-disable @typescript-eslint/naming-convention */
import { MockConfig } from '../../core/api/models/mock.model';
import { devices } from './mocks/devices';

export const loadingTime = 0.3; // seconds

export const mocks: MockConfig = {
  '/devices': { get: devices },
  '/devices/:id': { post: {} },
};
