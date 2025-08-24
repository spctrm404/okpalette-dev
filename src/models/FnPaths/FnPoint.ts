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
    this.observable = {
      ...this.observable,
      prevPt: undefined,
      nextPt: undefined,
      getRangeX: (): Range => {
        if (!this.prevPt || !this.nextPt)
          return [this.#initialCoord[0], this.#initialCoord[0]];
        return [this.prevPt.coord[0], this.nextPt.coord[0]];
      },
    };
  }

  get prevPt(): AnyFnPtInstance | undefined {
    return this.observable.prevPt;
  }
  get nextPt(): AnyFnPtInstance | undefined {
    return this.observable.nextPt;
  }

  set prevPt(prevPt: AnyFnPtInstance | undefined) {
    this.observable = {
      ...this.observable,
      prevPt,
    };
  }
  set nextPt(nextPt: AnyFnPtInstance | undefined) {
    this.observable = {
      ...this.observable,
      nextPt,
    };
  }

  getRangeX(): Range {
    return this.observable.getRangeX();
  }
}
