import type { Vec2 } from '@/types/index';
import Point from './Point';
import ControlPoint from './ControlPoint';

class BezierPoint extends Point {
  #prevControlPt: ControlPoint | null = null;
  #nextControlPt: ControlPoint | null = null;

  constructor(coord: Vec2, prevControlCoord?: Vec2, nextControlCoord?: Vec2) {
    super(coord);
    if (prevControlCoord)
      this.#prevControlPt = new ControlPoint(this, prevControlCoord);
    if (nextControlCoord)
      this.#nextControlPt = new ControlPoint(this, nextControlCoord);
    if (this.#prevControlPt && this.#nextControlPt) {
      this.#prevControlPt.twinPt = this.#nextControlPt;
      this.#nextControlPt.twinPt = this.#prevControlPt;
    }
  }

  set coord(coord: Vec2) {
    const prevCoord = this.coord;
    const delta = Point.sub(coord, prevCoord);
    super.coord = coord;
    if (this.#prevControlPt) {
      const prevCpAbsCoord = this.#prevControlPt?.absCoord;
      if (prevCpAbsCoord)
        this.#prevControlPt.absCoord = Point.add(prevCpAbsCoord, delta);
    }
    if (this.#nextControlPt) {
      const nextCpAbsCoord = this.#nextControlPt?.absCoord;
      if (nextCpAbsCoord)
        this.#nextControlPt.absCoord = Point.add(nextCpAbsCoord, delta);
    }
  }

  get prevPt(): Point | null {
    if (this.#prevControlPt === null) return null;
    return this.#prevControlPt.neighborPt;
  }
  set prevPt(prevPt: Point) {
    if (this.#prevControlPt === null)
      this.#prevControlPt = new ControlPoint(this, this.coord);
    this.#prevControlPt.neighborPt = prevPt;
  }

  get nextPt(): Point | null {
    if (this.#nextControlPt === null) return null;
    return this.#nextControlPt.neighborPt;
  }
  set nextPt(nextPt: Point) {
    if (this.#nextControlPt === null)
      this.#nextControlPt = new ControlPoint(this, this.coord);
    this.#nextControlPt.neighborPt = nextPt;
  }

  get prevControlPt(): ControlPoint | null {
    return this.#prevControlPt;
  }
  hasPrevControlPt(): boolean {
    return this.#prevControlPt?.isReadyToUse() !== null;
  }

  get nextControlPt(): ControlPoint | null {
    return this.#nextControlPt;
  }
  hasNextControlPt(): boolean {
    return this.#nextControlPt?.isReadyToUse() !== null;
  }
}

export default BezierPoint;
