import type { Vec2 } from '@/types';
import { Point } from './Point';

export class ExponentPoint extends Point {
  #exponent: number;

  constructor([x, y]: Vec2, exponent: number) {
    super([x, y]);
    this.#exponent = exponent;
  }

  get exponent(): number {
    return this.#exponent;
  }
  set exponent(exponent: number) {
    this.#exponent = exponent;
  }
}
