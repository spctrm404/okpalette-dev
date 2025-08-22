import type { AnyPoint, Coord, FnPtObsProps, Range } from './FnPath.type';
import { Point } from './Point';

export class FnPoint<T extends FnPtObsProps = FnPtObsProps>
  extends Point<T>
  implements FnPtObsProps
{
  #prevPt: AnyPoint | undefined;
  #nextPt: AnyPoint | undefined;

  constructor(coord: Coord) {
    super(coord);
  }

  get prevPt(): AnyPoint | undefined {
    return this.#prevPt;
  }
  get nextPt(): AnyPoint | undefined {
    return this.#nextPt;
  }

  set prevPt(prevPt: AnyPoint | undefined) {
    this.#prevPt = prevPt;
    this.notify();
  }
  set nextPt(nextPt: AnyPoint | undefined) {
    this.#nextPt = nextPt;
    this.notify();
  }

  get rangeX(): Range {
    return [this.prevPt?.coord[0], this.nextPt?.coord[0]];
  }
}
