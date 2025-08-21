import type { Coord, ExponentialPointProp } from './FnPath.type';
import { Point } from './Point';

export class ExponentialPoint extends Point<ExponentialPointProp> {
  constructor(coord: Coord, exponent: number) {
    super({ coord, exponent } as ExponentialPointProp);
  }

  get exponent(): number {
    return this.state.exponent;
  }
  set exponent(exponent: number) {
    this.state.exponent = exponent;
  }
}
