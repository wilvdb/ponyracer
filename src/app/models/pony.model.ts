export interface PonyModel {
  id: number;
  name: string;
  color: string;
}

export interface PonyWithPositionModel extends PonyModel {
  position: number;
}
