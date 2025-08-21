import type { AnyPoint, Coord, ControlPointProp } from './FnPath.type';
import type { BezierPoint } from './BezierPoint';
import { Point } from './Point';
import { map } from '@/utils';

export class ControlPoint extends Point<ControlPointProp> {
  #initialAbsCoord: Coord;

  constructor(parentPt: BezierPoint, initialAbsCoord: Coord) {
    super({
      coord: [0, 0],
      parentPt,
      isInitialized: false,
    } as ControlPointProp);
    this.#initialAbsCoord = initialAbsCoord;
  }

  get parentPt(): BezierPoint {
    return this.state.parentPt;
  }

  get neighborPt(): AnyPoint | undefined {
    return this.state.neighborPt;
  }
  set neighborPt(neighborPt: AnyPoint | undefined) {
    this.state.neighborPt = neighborPt;
    this.notify();
  }

  get twinPt(): ControlPoint | undefined {
    return this.state.twinPt;
  }
  set twinPt(twinPt: ControlPoint | undefined) {
    this.state.twinPt = twinPt;
    this.notify();
  }
  get hasTwin(): boolean {
    return this.state.twinPt !== undefined;
  }

  get isInitialized(): boolean {
    return this.state.isInitialized;
  }
  get isUsable(): boolean {
    return this.neighborPt !== null && this.isInitialized;
  }
  get isActive(): boolean {
    const [x, y] = this.coord;
    return x !== 0 || y !== 0;
  }

  get absCoord(): Coord {
    if (!this.neighborPt) return this.#initialAbsCoord;
    return map(
      this.coord,
      [0, 0],
      [1, 1],
      this.parentPt.coord,
      this.neighborPt.coord
    ) as Coord;
  }
  set absCoord(absCoord: Coord) {
    if (!this.neighborPt) return;
    this.coord = map(
      absCoord,
      this.parentPt.coord,
      this.neighborPt.coord,
      [0, 0],
      [1, 1]
    ) as Coord;
  }

  initializeCoordFromAbsCoord(): void {
    if (!this.neighborPt) return;
    this.coord = map(
      this.#initialAbsCoord,
      this.parentPt.coord,
      this.neighborPt.coord,
      [0, 0],
      [1, 1]
    ) as Coord;
    this.state.isInitialized = true;
  }

  syncTwin(syncLength = false): void {
    if (!this.twinPt) return;
    const vec2ToParent = Point.sub(this.parentPt.coord, this.absCoord);
    if (syncLength) {
      this.twinPt.absCoord = Point.add(this.parentPt.coord, vec2ToParent);
    } else {
      const [toParentX, toParentY] = vec2ToParent;
      const angle = Math.atan2(toParentY, toParentX);
      const [fromParentToTwinX, fromParentToTwinY] = Point.sub(
        this.twinPt.absCoord,
        this.parentPt.coord
      );
      const length = Math.hypot(fromParentToTwinX, fromParentToTwinY);
      const [px, py] = this.parentPt.coord;
      this.twinPt.absCoord = [
        px + length * Math.cos(angle),
        py + length * Math.sin(angle),
      ] as Coord;
    }
  }
}
