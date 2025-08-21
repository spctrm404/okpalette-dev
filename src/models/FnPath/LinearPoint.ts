import type { Coord, LinearPointProp } from './FnPath.type';
import { Point } from './Point';

export class LinearPoint extends Point<LinearPointProp> {
  constructor(coord: Coord) {
    super({ coord } as LinearPointProp);
  }
}
