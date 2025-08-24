import type { AnyFnPtInstance, Coord, BezierPtObsProps } from './FnPath.type';
import { FnPoint } from './FnPoint';
import { ControlPoint } from './ControlPoint';

export class BezierPoint
  extends FnPoint<BezierPtObsProps>
  implements BezierPtObsProps
{
  constructor(coord: Coord, prevCp?: Coord, nextCp?: Coord) {
    super(coord);
    this.props = {
      ...this.props,
      prevCp: new ControlPoint(this, prevCp || coord),
      nextCp: new ControlPoint(this, nextCp || coord),
    };
    this.prevCp.twinPt = this.nextCp;
    this.nextCp.twinPt = this.prevCp;
  }

  get prevPt(): AnyFnPtInstance | undefined {
    return super.prevPt;
  }
  get nextPt(): AnyFnPtInstance | undefined {
    return super.nextPt;
  }

  set prevPt(prevPt: AnyFnPtInstance | undefined) {
    super.prevPt = prevPt;
    this.prevCp.neighborPt = prevPt;
  }
  set nextPt(nextPt: AnyFnPtInstance | undefined) {
    super.nextPt = nextPt;
    this.nextCp.neighborPt = nextPt;
  }

  get prevCp(): ControlPoint {
    return this.props.prevCp;
  }
  get nextCp(): ControlPoint {
    return this.props.nextCp;
  }
}
