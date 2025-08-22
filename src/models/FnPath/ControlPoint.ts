import type { AnyPoint, Coord, ControlPtObsProps } from './FnPath.type';
import type { BezierPoint } from './BezierPoint';
import { Point } from './Point';
import { map } from '@/utils';

export class ControlPoint
  extends Point<ControlPtObsProps>
  implements ControlPtObsProps
{
  #initialAbsCoord: Coord;
  #parentPt: BezierPoint;
  #neighborPt: AnyPoint | undefined;
  #twinPt: ControlPoint | undefined;
  #isInitialized: boolean = false;

  constructor(parentPt: BezierPoint, initialAbsCoord: Coord) {
    super([0, 0]);
    this.#initialAbsCoord = initialAbsCoord;
    this.#parentPt = parentPt;
  }

  get parentPt(): BezierPoint {
    return this.#parentPt;
  }

  get neighborPt(): AnyPoint | undefined {
    return this.#neighborPt;
  }
  set neighborPt(neighborPt: AnyPoint | undefined) {
    this.#neighborPt = neighborPt;
    this.notify();
  }

  get twinPt(): ControlPoint {
    return this.#twinPt!;
  }
  set twinPt(twinPt: ControlPoint) {
    this.#twinPt = twinPt;
    this.notify();
  }

  get isInitialized(): boolean {
    return this.#isInitialized;
  }
  get isUsable(): boolean {
    return this.neighborPt !== undefined && this.isInitialized;
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
    this.#isInitialized = true;
    this.notify();
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
