import { PoneyModel } from './poney.model';

export interface RaceModel {
  id: number;
  startInstant: string;
  name: string;
  ponies: PoneyModel[];
}
