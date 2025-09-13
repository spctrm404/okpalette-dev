import type { Vec2 } from '@/types';
import type { AnyFnPtInstance, BezierPtObsProps } from './FnPaths.type';
import { FnPoint } from './FnPoint';
import { ControlPoint } from './ControlPoint';

export class BezierPoint extends FnPoint<BezierPtObsProps> {
  #prevCp: ControlPoint;
  #nextCp: ControlPoint;
  constructor(coord: Vec2, prevCp?: Vec2, nextCp?: Vec2) {
    super(coord);
    this.#prevCp = new ControlPoint(this, prevCp || this.coord);
    this.#nextCp = new ControlPoint(this, nextCp || this.coord);
    this.prevCp.twinPt = this.nextCp;
    this.nextCp.twinPt = this.prevCp;
    this.props = {
      getPrevCp: () => this.prevCp,
      getNextCp: () => this.nextCp,
    } as Partial<BezierPtObsProps>;
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
    this.notify();
  }
  set nextPt(nextPt: AnyFnPtInstance | undefined) {
    super.nextPt = nextPt;
    this.nextCp.neighborPt = nextPt;
    this.notify();
  }

  get prevCp(): ControlPoint {
    return this.#prevCp;
  }
  get nextCp(): ControlPoint {
    return this.#nextCp;
  }
}
