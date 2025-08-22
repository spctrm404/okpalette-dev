import type { Coord, ExponentialPtObsProps } from './FnPath.type';
import { FnPoint } from './FnPoint';

export class ExponentialPoint
  extends FnPoint<ExponentialPtObsProps>
  implements ExponentialPtObsProps
{
  #exponent: number;

  constructor(coord: Coord, exponent: number) {
    super(coord);
    this.#exponent = exponent;
  }

  get exponent(): number {
    return this.#exponent;
  }
  set exponent(exponent: number) {
    this.#exponent = exponent;
    this.notify();
  }
}
