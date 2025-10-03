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

export interface DeviceLogRaw {
  event_time: number;
  code: string;
  value: string;

  status: string;
  event_from: string;
  event_id: number;
}

export interface DeviceLog extends DeviceLogRaw {
  date: Date;
}
