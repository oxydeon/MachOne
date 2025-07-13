import { Device, StatusCode } from '../../api/models/device.model';
import { DimmerSwitchStatusCode } from '../../api/models/dimmer-switch-device.model';
import { TemperatureStatusCode } from '../../api/models/temperature-device.model';

type DeviceStatusCode = StatusCode | TemperatureStatusCode | DimmerSwitchStatusCode;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getStatus(device: Device, statusCode: DeviceStatusCode): any {
  return device.status?.find((status) => status.code === statusCode)?.value;
}

export function getStatusIndex(device: Device, statusCode: DeviceStatusCode): number | undefined {
  return device.status?.findIndex((status) => status.code === statusCode);
}
