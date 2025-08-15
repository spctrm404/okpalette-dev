import type { Vec2 } from '@/types';
import { map } from '@/utils';
import { Point } from './Point';

export class ControlPoint extends Point {
  #initialAbsX: number;
  #initialAbsY: number;
  #parentPt: Point;
  #neighborPt: Point | null = null;
  #twinPt: ControlPoint | null = null;
  #isInitialized: boolean;

  constructor(parentPt: Point, [initialAbsX, initialAbsY]: Vec2) {
    super([0, 0]);
    this.#parentPt = parentPt;
    this.#initialAbsX = initialAbsX;
    this.#initialAbsY = initialAbsY;
    this.#isInitialized = false;
  }

  get neighborPt(): Point | null {
    return this.#neighborPt;
  }
  set neighborPt(neighborPt: Point | null) {
    this.#neighborPt = neighborPt;
    this._emit();
  }

  get twinPt(): ControlPoint | null {
    return this.#twinPt;
  }
  set twinPt(twinPt: ControlPoint) {
    this.#twinPt = twinPt;
    this._emit();
  }
  get hasTwin(): boolean {
    return this.#twinPt !== null;
  }

  get isInitialized(): boolean {
    return this.#isInitialized;
  }

  get isUsable(): boolean {
    return this.#neighborPt !== null && this.#isInitialized;
  }

  get isActive(): boolean {
    const [x, y] = this.coord;
    return x !== 0 || y !== 0;
  }

  get absCoord(): Vec2 {
    if (!this.#neighborPt) return [this.#initialAbsX, this.#initialAbsY];
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
      this.#parentPt.coord,
      this.#neighborPt.coord,
      [0, 0],
      [1, 1]
    ) as Vec2;
  }

  initializeCoordFromAbsCoord(): void {
    if (!this.#neighborPt) return;
    this.coord = map(
      [this.#initialAbsX, this.#initialAbsY],
      this.#parentPt.coord,
      this.#neighborPt.coord,
      [0, 0],
      [1, 1]
    ) as Vec2;
    this.#isInitialized = true;
  }

  syncTwin(syncLength = false): void {
    if (!this.#twinPt) return;
    const vec2ToParent = Point.sub(this.#parentPt.coord, this.absCoord);
    if (syncLength) {
      this.#twinPt.absCoord = Point.add(this.#parentPt.coord, vec2ToParent);
    } else {
      const [toParentX, toParentY] = vec2ToParent;
      const angle = Math.atan2(toParentY, toParentX);
      const [fromParentToTwinX, fromParentToTwinY] = Point.sub(
        this.#twinPt.absCoord,
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
}
