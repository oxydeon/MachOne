import { ValveState } from '../../shared/api/models/valve.model';

export interface ValveDataPoint {
  x: Date;
  y: number;
  state?: ValveState;
}
