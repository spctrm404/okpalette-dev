import type { AnyPoint, Coord, BezierPointProp } from './FnPath.type';
import { Point } from './Point';
import { ControlPoint } from './ControlPoint';

export class BezierPoint extends Point<BezierPointProp> {
  constructor(coord: Coord, prevCp?: Coord, nextCp?: Coord) {
    super({
      coord,
    } as BezierPointProp);
    this.state.prevCp = new ControlPoint(this, prevCp || coord);
    this.state.nextCp = new ControlPoint(this, nextCp || coord);
    this.state.prevCp.twinPt = this.state.nextCp;
    this.state.nextCp.twinPt = this.state.prevCp;
  }

  get prevPt(): AnyPoint | undefined {
    return this.state.prevCp?.neighborPt;
  }
  get nextPt(): AnyPoint | undefined {
    return this.state.nextCp?.neighborPt;
  }

  set prevPt(prevPt: AnyPoint | undefined) {
    this.prevCp!.neighborPt = prevPt;
  }
  set nextPt(nextPt: AnyPoint | undefined) {
    this.nextCp!.neighborPt = nextPt;
  }

  get prevCp(): ControlPoint {
    return this.state.prevCp!;
  }
  get nextCp(): ControlPoint {
    return this.state.nextCp!;
  }
}
