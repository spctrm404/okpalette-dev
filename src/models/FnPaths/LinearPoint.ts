import type { Coord, LinearPtObsProps } from './FnPath.type';
import { FnPoint } from './FnPoint';

export class LinearPoint extends FnPoint<LinearPtObsProps> {
  constructor(coord: Coord) {
    super(coord);
  }
}
