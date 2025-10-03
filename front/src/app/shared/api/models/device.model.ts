/* eslint-disable @typescript-eslint/naming-convention */

export interface Device {
  id: string;
  name: string;
  category: string;
  online: boolean;
  status: {
    code: string;
    value: unknown;
  }[];
}

export interface DeviceLogs {
  logs: DeviceLog[];
}

export interface DeviceLog {
  code: string;
  value: string;
  status: string;
  event_code: string;
  event_from: string;
  event_id: number;
  event_time: number;
}
