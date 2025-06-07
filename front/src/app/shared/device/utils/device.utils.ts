import { Device, StatusCode } from '../../api/models/device.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getStatus(device: Device, statusCode: StatusCode): any {
  return device.status?.find((status) => status.code === statusCode)?.value;
}

export function getStatusIndex(device: Device, statusCode: StatusCode): number | undefined {
  return device.status?.findIndex((status) => status.code === statusCode);
}
