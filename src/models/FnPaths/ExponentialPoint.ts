import type { Coord, ExponentialPtObsProps } from './FnPath.type';
import { FnPoint } from './FnPoint';

export class ExponentialPoint
  extends FnPoint<ExponentialPtObsProps>
  implements ExponentialPtObsProps
{
  constructor(coord: Coord, exponent: number) {
    super(coord);
    this.props = {
      ...this.props,
      exponent,
    };
  }

  get exponent(): number {
    return this.props.exponent;
  }
  set exponent(exponent: number) {
    this.props = {
      ...this.props,
      exponent,
    };
  }
}
