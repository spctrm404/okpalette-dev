import type { Vec2 } from '@/types';
import type { AnyFnPtInstance, ControlPtObsProps } from './FnPath.type';
import type { BezierPoint } from './BezierPoint';
import { Point } from './Point';
import { map } from '@/utils';

export class ControlPoint extends Point<ControlPtObsProps> {
  #initialAbsCoord: Vec2;
  #parentPt: BezierPoint;
  #neighborPt: AnyFnPtInstance | undefined;
  #twinPt: ControlPoint | undefined;
  #isInitialized = false;

  constructor(parentPt: BezierPoint, initialAbsCoord: Vec2) {
    super([0, 0]);
    this.#initialAbsCoord = initialAbsCoord;
    this.#parentPt = parentPt;
    this.#neighborPt = undefined;
    this.#twinPt = undefined;
    this.#isInitialized = false;
    this.props = {
      getParentPt: () => this.parentPt,
      getNeighborPt: () => this.neighborPt,
      getTwinPt: () => this.twinPt,
      isInitialized: () => this.isInitialized,
      isUsable: () => this.isUsable,
      isActive: () => this.isActive,
      getAbsCoord: () => this.absCoord,
    };
  }

  get parentPt(): BezierPoint {
    return this.#parentPt;
  }

  get neighborPt(): AnyFnPtInstance | undefined {
    return this.#neighborPt;
  }
  set neighborPt(neighborPt: AnyFnPtInstance | undefined) {
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

  get absCoord(): Vec2 {
    if (!this.neighborPt) return this.#initialAbsCoord;
    return map(
      this.coord,
      [0, 0],
      [1, 1],
      this.parentPt.coord,
      this.neighborPt.coord
    ) as Vec2;
  }
  set absCoord(absCoord: Vec2) {
    if (!this.neighborPt) return;
    this.coord = map(
      absCoord,
      this.parentPt.coord,
      this.neighborPt.coord,
      [0, 0],
      [1, 1]
    ) as Vec2;
    this.notify();
  }

  initializeCoordFromAbsCoord(): void {
    if (!this.neighborPt) return;
    this.#isInitialized = true;
    this.coord = map(
      this.#initialAbsCoord,
      this.parentPt.coord,
      this.neighborPt.coord,
      [0, 0],
      [1, 1]
    ) as Vec2;
  }

  syncTwin(syncLength = false): void {
    if (!this.twinPt) return;
    const vec2ToParent = Point.sub(this.parentPt.coord, this.absCoord);
    if (syncLength) {
      const lengthSyncedCoord = Point.add(this.parentPt.coord, vec2ToParent);
      this.twinPt.absCoord = lengthSyncedCoord;
    } else {
      const [toParentX, toParentY] = vec2ToParent;
      const angle = Math.atan2(toParentY, toParentX);
      const [fromParentToTwinX, fromParentToTwinY] = Point.sub(
        this.twinPt.absCoord,
        this.parentPt.coord
      );
      const length = Math.hypot(fromParentToTwinX, fromParentToTwinY);
      const [px, py] = this.parentPt.coord;
      const angleSyncedCoord = [
        px + length * Math.cos(angle),
        py + length * Math.sin(angle),
      ];
      this.twinPt.absCoord = angleSyncedCoord as Vec2;
    }
  }
}
