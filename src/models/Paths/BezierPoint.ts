import type { Vec2 } from '@/types';
import { Point } from './Point';
import { ControlPoint } from './ControlPoint';

export class BezierPoint extends Point {
  #prevCp: ControlPoint;
  #nextCp: ControlPoint;

  constructor(coord: Vec2, prevCp?: Vec2, nextCp?: Vec2) {
    super(coord);
    this.#prevCp = new ControlPoint(this, prevCp || coord);
    this.#nextCp = new ControlPoint(this, nextCp || coord);
    this.#prevCp.twinPt = this.#nextCp;
    this.#nextCp.twinPt = this.#prevCp;
  }

  get prevPt(): Point | null {
    return this.#prevCp.neighborPt;
  }
  get nextPt(): Point | null {
    if (this.#nextCp === null) return null;
    return this.#nextCp.neighborPt;
  }

  set prevPt(prevPt: Point | null) {
    this.#prevCp.neighborPt = prevPt;
  }
  set nextPt(nextPt: Point | null) {
    this.#nextCp.neighborPt = nextPt;
  }

  get prevCp(): ControlPoint {
    return this.#prevCp;
  }
  get nextCp(): ControlPoint {
    return this.#nextCp;
  }
}
