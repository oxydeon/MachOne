/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Device {
  id: string;
  name: string;
  category: string;
  online: boolean;
  status: {
    code: string;
    value: any;
  }[];
}
