import type { Vec2 } from '@/types/index';
import { map } from '@UTILS/index';
import Point from './Point';

class ControlPoint extends Point {
  #parentPt: Point;
  #neighborPt: Point | null = null;
  #twinPt: ControlPoint | null = null;

  constructor(parentPt: Point, absCoord: Vec2) {
    super([0, 0]);
    this.#parentPt = parentPt;
    this.absCoord = absCoord;
  }

  get neighborPt(): Point | null {
    return this.#neighborPt;
  }
  set neighborPt(neighborPt: Point | null) {
    this.#neighborPt = neighborPt;
  }

  get twinPt(): ControlPoint | null {
    return this.#twinPt;
  }
  set twinPt(twinPt: ControlPoint) {
    this.#twinPt = twinPt;
  }
  hasTwin(): boolean {
    return this.#twinPt !== null;
  }

  get absCoord(): Vec2 | null {
    if (!this.#neighborPt) return null;
    return map(
      this.coord,
      [0, 0],
      [1, 1],
      this.#parentPt.coord,
      this.#neighborPt.coord
    ) as Vec2;
  }
  set absCoord(absCoord: Vec2) {
    if (!this.#neighborPt) return;
    this.coord = map(
      absCoord,
      [0, 0],
      [1, 1],
      this.#parentPt.coord,
      this.#neighborPt.coord
    ) as Vec2;
  }

  syncTwin(syncLength = false): void {
    if (!this.#twinPt) return;
    const vec2ToParent = Point.sub(this.#parentPt.coord, this.absCoord as Vec2);
    if (syncLength) {
      this.#twinPt.absCoord = Point.add(this.#parentPt.coord, vec2ToParent);
    } else {
      const [toParentX, toParentY] = vec2ToParent;
      const angle = Math.atan2(toParentY, toParentX);
      const [fromParentToTwinX, fromParentToTwinY] = Point.sub(
        this.#twinPt.absCoord as Vec2,
        this.#parentPt.coord
      );
      const length = Math.hypot(fromParentToTwinX, fromParentToTwinY);
      const [px, py] = this.#parentPt.coord;
      this.#twinPt.absCoord = [
        px + length * Math.cos(angle),
        py + length * Math.sin(angle),
      ] as Vec2;
    }
  }

  isReadyToUse(): boolean {
    return this.#neighborPt !== null;
  }
}

export default ControlPoint;
