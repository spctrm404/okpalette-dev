import type { Coord, ExponentialPtObsProps } from './FnPath.type';
import { FnPoint } from './FnPoint';

export class ExponentialPoint extends FnPoint<ExponentialPtObsProps> {
  #exponent: number;
  constructor(coord: Coord, exponent: number) {
    super(coord);
    this.#exponent = exponent;
    this.props = {
      getExponent: () => this.exponent,
    } as Partial<ExponentialPtObsProps>;
  }

  get exponent(): number {
    return this.#exponent;
  }
  set exponent(exponent: number) {
    this.#exponent = exponent;
  }
}
