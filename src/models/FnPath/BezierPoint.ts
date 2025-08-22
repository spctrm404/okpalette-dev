import type { AnyPoint, Coord, BezierPtObsProps } from './FnPath.type';
import { FnPoint } from './FnPoint';
import { ControlPoint } from './ControlPoint';

export class BezierPoint
  extends FnPoint<BezierPtObsProps>
  implements BezierPtObsProps
{
  #prevCp: ControlPoint;
  #nextCp: ControlPoint;

  constructor(coord: Coord, prevCp?: Coord, nextCp?: Coord) {
    super(coord);
    this.#prevCp = new ControlPoint(this, prevCp || coord);
    this.#nextCp = new ControlPoint(this, nextCp || coord);
    this.prevCp.twinPt = this.nextCp;
    this.nextCp.twinPt = this.prevCp;
  }

  set prevPt(prevPt: AnyPoint | undefined) {
    super.prevPt = prevPt;
    this.prevCp.neighborPt = prevPt;
  }
  set nextPt(nextPt: AnyPoint | undefined) {
    super.nextPt = nextPt;
    this.nextCp.neighborPt = nextPt;
  }

  get prevCp(): ControlPoint {
    return this.#prevCp;
  }
  get nextCp(): ControlPoint {
    return this.#nextCp;
  }
}
