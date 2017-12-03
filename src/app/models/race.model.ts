import { PonyModel } from './pony.model';

export interface RaceModel {
  id: number;
  betPonyId?: number;
  name: string;
  ponies: Array<PonyModel>;
  startInstant: string;
}
