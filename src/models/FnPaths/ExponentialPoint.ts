import type { Vec2 } from '@/types';
import type { ExponentialPtObsProps } from './FnPaths.type';
import { FnPoint } from './FnPoint';

export class ExponentialPoint extends FnPoint<ExponentialPtObsProps> {
  #exponent: number;
  constructor(coord: Vec2, exponent: number) {
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
