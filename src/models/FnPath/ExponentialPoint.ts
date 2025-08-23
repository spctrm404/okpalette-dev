import type { Coord, ExponentialPtObsProps } from './FnPath.type';
import { FnPoint } from './FnPoint';

export class ExponentialPoint
  extends FnPoint<ExponentialPtObsProps>
  implements ExponentialPtObsProps
{
  constructor(coord: Coord, exponent: number) {
    super(coord);
    this.observable = {
      ...this.observable,
      exponent,
    };
  }

  get exponent(): number {
    return this.observable.exponent;
  }
  set exponent(exponent: number) {
    this.observable = {
      ...this.observable,
      exponent,
    };
  }
}
