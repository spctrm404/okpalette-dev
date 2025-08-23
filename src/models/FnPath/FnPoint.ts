import type { AnyPoint, Coord, FnPtObsProps, Range } from './FnPath.type';
import { Point } from './Point';

export class FnPoint<T extends FnPtObsProps = FnPtObsProps>
  extends Point<T>
  implements FnPtObsProps
{
  constructor(coord: Coord) {
    super(coord);
    this.observable = {
      ...this.observable,
      prevPt: undefined,
      nextPt: undefined,
      rangeX: (): Range => {
        return [this.prevPt?.coord[0], this.nextPt?.coord[0]];
      },
    };
  }

  get prevPt(): AnyPoint | undefined {
    return this.observable.prevPt;
  }
  get nextPt(): AnyPoint | undefined {
    return this.observable.nextPt;
  }

  set prevPt(prevPt: AnyPoint | undefined) {
    this.observable = {
      ...this.observable,
      prevPt,
    };
  }
  set nextPt(nextPt: AnyPoint | undefined) {
    this.observable = {
      ...this.observable,
      nextPt,
    };
  }

  rangeX(): Range {
    return this.observable.rangeX();
  }
}
