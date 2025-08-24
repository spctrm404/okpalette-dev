import type {
  AnyFnPtInstance,
  Coord,
  FnPtObsProps,
  Range,
} from './FnPath.type';
import { Point } from './Point';

export class FnPoint<T extends FnPtObsProps = FnPtObsProps>
  extends Point<T>
  implements FnPtObsProps
{
  #initialCoord: Coord;

  constructor(coord: Coord) {
    super(coord);
    this.#initialCoord = coord;
    this.props = {
      ...this.props,
      prevPt: undefined,
      nextPt: undefined,
      getRangeX: (): Range => this.getRangeX(),
    };
  }

  get prevPt(): AnyFnPtInstance | undefined {
    return this.props.prevPt;
  }
  get nextPt(): AnyFnPtInstance | undefined {
    return this.props.nextPt;
  }

  set prevPt(prevPt: AnyFnPtInstance | undefined) {
    this.props = {
      ...this.props,
      prevPt,
    };
  }
  set nextPt(nextPt: AnyFnPtInstance | undefined) {
    this.props = {
      ...this.props,
      nextPt,
    };
  }

  getRangeX(): Range {
    if (!this.prevPt || !this.nextPt)
      return [this.#initialCoord[0], this.#initialCoord[0]];
    return [this.prevPt.coord[0], this.nextPt.coord[0]];
  }
}
