import type { Vec2 } from '@/types/index';
import Point from './Point';
import ControlPoint from './ControlPoint';

class BezierPoint extends Point {
  #prevControlPt: ControlPoint | null = null;
  #nextControlPt: ControlPoint | null = null;

  constructor([x, y]: Vec2, prevControlCoord?: Vec2, nextControlCoord?: Vec2) {
    super([x, y]);
    if (prevControlCoord)
      this.#prevControlPt = new ControlPoint(prevControlCoord, this);
    if (nextControlCoord)
      this.#nextControlPt = new ControlPoint(nextControlCoord, this);
    if (this.#prevControlPt && this.#nextControlPt) {
      this.#prevControlPt.twinPt = this.#nextControlPt;
      this.#nextControlPt.twinPt = this.#prevControlPt;
    }
  }

  set coord(coord: Vec2) {
    const prevCoord = this.coord;
    const delta = Point.sub(coord, prevCoord);
    super.coord = coord;
    if (this.#prevControlPt)
      this.#prevControlPt.coord = Point.add(this.#prevControlPt.coord, delta);
    if (this.#nextControlPt)
      this.#nextControlPt.coord = Point.add(this.#nextControlPt.coord, delta);
  }

  get prevPt(): Point | null {
    if (this.#prevControlPt === null) return null;
    return this.#prevControlPt.neighborPt;
  }
  set prevPt(prevPt: Point | null) {
    if (prevPt !== null) {
      if (this.#prevControlPt !== null) {
        this.#prevControlPt.neighborPt = prevPt;
      } else {
        this.#prevControlPt = new ControlPoint(this.coord, this);
        this.#prevControlPt.neighborPt = prevPt;
      }
    } else {
      this.#prevControlPt = null;
    }
  }

  get nextPt(): Point | null {
    if (this.#nextControlPt === null) return null;
    return this.#nextControlPt.neighborPt;
  }
  set nextPt(nextPt: Point | null) {
    if (nextPt !== null) {
      if (this.#nextControlPt !== null) {
        this.#nextControlPt.neighborPt = nextPt;
      } else {
        this.#nextControlPt = new ControlPoint(this.coord, this);
        this.#nextControlPt.neighborPt = nextPt;
      }
    } else {
      this.#nextControlPt = null;
    }
  }

  get prevControlPt(): ControlPoint | null {
    return this.#prevControlPt;
  }
  hasPrevControlPt(): boolean {
    return this.#prevControlPt !== null;
  }

  get nextControlPt(): ControlPoint | null {
    return this.#nextControlPt;
  }
  hasNextControlPt(): boolean {
    return this.#nextControlPt !== null;
  }
}

export default BezierPoint;
