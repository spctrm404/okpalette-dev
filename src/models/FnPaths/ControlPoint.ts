import type { AnyFnPtInstance, Coord, ControlPtObsProps } from './FnPath.type';
import type { BezierPoint } from './BezierPoint';
import { Point } from './Point';
import { map } from '@/utils';

export class ControlPoint
  extends Point<ControlPtObsProps>
  implements ControlPtObsProps
{
  #initialAbsCoord: Coord;
  #isInitialized = false;

  constructor(parentPt: BezierPoint, initialAbsCoord: Coord) {
    super([0, 0]);
    this.#initialAbsCoord = initialAbsCoord;
    this.#isInitialized = false;
    this.observable = {
      ...this.observable,
      parentPt,
      neighborPt: undefined,
      twinPt: undefined,
      isInitialized: (): boolean => {
        return this.#isInitialized;
      },
      isUsable: (): boolean => {
        return this.neighborPt !== undefined && this.isInitialized();
      },
      isActive: (): boolean => {
        const [x, y] = this.coord;
        return x !== 0 || y !== 0;
      },
      absCoord: (): Coord => {
        if (!this.neighborPt) return this.#initialAbsCoord;
        return map(
          this.coord,
          [0, 0],
          [1, 1],
          this.parentPt.coord,
          this.neighborPt.coord
        ) as Coord;
      },
    };
  }

  get parentPt(): BezierPoint {
    return this.observable.parentPt;
  }

  get neighborPt(): AnyFnPtInstance | undefined {
    return this.observable.neighborPt;
  }
  set neighborPt(neighborPt: AnyFnPtInstance | undefined) {
    this.observable = {
      ...this.observable,
      neighborPt,
    };
  }

  get twinPt(): ControlPoint {
    return this.observable.twinPt!;
  }
  set twinPt(twinPt: ControlPoint) {
    this.observable = {
      ...this.observable,
      twinPt,
    };
  }

  isInitialized(): boolean {
    return this.observable.isInitialized();
  }
  isUsable(): boolean {
    return this.observable.isUsable();
  }
  isActive(): boolean {
    const [x, y] = this.coord;
    return x !== 0 || y !== 0;
  }

  absCoord(): Coord {
    return this.observable.absCoord();
  }
  setAbsCoord(absCoord: Coord) {
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
  }

  syncTwin(syncLength = false): void {
    if (!this.twinPt) return;
    const vec2ToParent = Point.sub(this.parentPt.coord, this.absCoord());
    if (syncLength) {
      const lengthSyncedCoord = Point.add(this.parentPt.coord, vec2ToParent);
      this.twinPt.setAbsCoord(lengthSyncedCoord);
    } else {
      const [toParentX, toParentY] = vec2ToParent;
      const angle = Math.atan2(toParentY, toParentX);
      const [fromParentToTwinX, fromParentToTwinY] = Point.sub(
        this.twinPt.absCoord(),
        this.parentPt.coord
      );
      const length = Math.hypot(fromParentToTwinX, fromParentToTwinY);
      const [px, py] = this.parentPt.coord;
      const angleSyncedCoord = [
        px + length * Math.cos(angle),
        py + length * Math.sin(angle),
      ] as Coord;
      this.twinPt.setAbsCoord(angleSyncedCoord);
    }
  }
}
