import type { AnyPoint } from './FnPath.type';
import type { FnPath } from './FnPath';
import { LinearPoint } from './LinearPoint';
import { BezierPoint } from './BezierPoint';
import { ExponentialPoint } from './ExponentialPoint';

export type Points = AnyPoint[];
export type Paths = FnPath[];

export class FnPaths {
  #points: Points;

  constructor() {
    this.#points = [];
  }

  get points(): Points {
    return this.#points;
  }

  get pointCnt(): number {
    return this.#points.length;
  }

  getPoint(idx: number): AnyPoint | undefined {
    return this.#points[idx];
  }

  getPointIdx(point: AnyPoint): number {
    return this.#points.indexOf(point);
  }

  addPoint(point: AnyPoint, idx?: number): void {
    if (idx === undefined) {
      this.#points.push(point);
      this.updateLinks(this.pointCnt - 1);
    } else if (idx >= 0 && idx <= this.pointCnt) {
      this.#points.splice(idx, 0, point);
      this.updateLinks(idx);
    }
  }

  removePoint(targetPt: AnyPoint): void {
    const targetPtIdx = this.getPointIdx(targetPt);
    if (targetPtIdx < 0) return;
    const leftPt = this.#points[targetPtIdx - 1];
    const rightPt = this.#points[targetPtIdx + 1];
    targetPt.unsubscribeAll();
    this.#points.splice(targetPtIdx, 1);
    leftPt.nextPt = rightPt;
    rightPt.prevPt = leftPt;
    if (leftPt instanceof BezierPoint && !leftPt.nextCp.isInitialized)
      leftPt.nextCp.initializeCoordFromAbsCoord();
    if (rightPt instanceof BezierPoint && !rightPt.prevCp.isInitialized)
      rightPt.prevCp.initializeCoordFromAbsCoord();
  }

  overridePoint(targetPt: AnyPoint, newPt: AnyPoint): void {
    const targetPtIdx = this.getPointIdx(targetPt);
    if (targetPtIdx < 0) return;
    const { id: oldId } = targetPt;
    newPt.id = oldId;
    targetPt.unsubscribeAll();
    this.#points[targetPtIdx] = newPt;
    this.updateLinks(targetPtIdx);
  }

  private updateLinks(idx: number): void {
    const point = this.#points[idx];
    const leftPt = this.#points[idx - 1];
    const rightPt = this.#points[idx + 1];
    if (point) {
      point.prevPt = leftPt;
      point.nextPt = rightPt;
      if (point instanceof BezierPoint) {
        if (!point.prevCp.isInitialized)
          point.prevCp.initializeCoordFromAbsCoord();
        if (!point.nextCp.isInitialized)
          point.nextCp.initializeCoordFromAbsCoord();
      }
    }
    if (leftPt) {
      leftPt.nextPt = point;
      if (leftPt instanceof BezierPoint && !leftPt.nextCp.isInitialized)
        leftPt.nextCp.initializeCoordFromAbsCoord();
    }
    if (rightPt) {
      rightPt.prevPt = point;
      if (rightPt instanceof BezierPoint && !rightPt.prevCp.isInitialized)
        rightPt.prevCp.initializeCoordFromAbsCoord();
    }
  }

  static fromArray(pathsArray: number[][]): FnPaths {
    const path = new FnPaths();
    pathsArray?.forEach((aPointArray) => {
      if (aPointArray.length === 2) {
        const [x, y] = aPointArray;
        path.addPoint(new LinearPoint([x, y]));
      } else if (aPointArray.length === 3) {
        const [x, y, exponent] = aPointArray;
        path.addPoint(new ExponentialPoint([x, y], exponent));
      } else if (aPointArray.length === 6) {
        const [x, y, pcpX, pcpY, ncpX, ncpY] = aPointArray;
        path.addPoint(new BezierPoint([x, y], [pcpX, pcpY], [ncpX, ncpY]));
      }
    });
    return path;
  }
}
