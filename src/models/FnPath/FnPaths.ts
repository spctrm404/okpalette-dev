import type { AnyPoint, Coord } from './FnPath.type';
import type { FnPath } from './FnPath';
import { LinearPoint } from './LinearPoint';
import { BezierPoint } from './BezierPoint';
import { ExponentialPoint } from './ExponentialPoint';

export type Points = AnyPoint[];
export type Paths = FnPath[];

export class FnPaths {
  #points: Points;
  #paths: Paths;

  constructor() {
    this.#points = [];
    this.#paths = [];
  }

  get points(): Points {
    return this.#points;
  }
  get paths(): Paths {
    return this.#paths;
  }

  get pointCnt(): number {
    return this.#points.length;
  }
  get pathCnt(): number {
    return this.#paths.length;
  }

  getPoint(idx: number): AnyPoint | undefined {
    return this.#points[idx];
  }
  getPath(idx: number): FnPath | undefined {
    return this.#paths[idx];
  }

  getPointIdx(point: AnyPoint): number {
    return this.#points.indexOf(point);
  }
  getPathIdx(path: FnPath): number {
    return this.#paths.indexOf(path);
  }

  getPathsContainingPoint(
    point: AnyPoint
  ): [FnPath | undefined, FnPath | undefined] | undefined {
    const pointIdx = this.getPointIdx(point);
    if (pointIdx < 0) return;
    const leftPath = this.#paths[pointIdx - 1];
    const rightPath = this.#paths[pointIdx];
    return [leftPath, rightPath];
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

  removePoint(point: AnyPoint): void {
    const pointIdx = this.getPointIdx(point);
    if (pointIdx < 0) return;
    const targetPt = this.getPoint(pointIdx)!;
    targetPt.unsubscribeAll();
    this.#points.splice(pointIdx, 1);
    this.updateLinks(pointIdx);
  }

  overridePoint(targetPt: AnyPoint, newPt: AnyPoint): void {
    const targetPtIdx = this.getPointIdx(targetPt);
    if (targetPtIdx < 0) return;
    const { id: oldId } = targetPt;
    newPt.id = oldId;
    this.#points[targetPtIdx] = newPt;
    this.updateLinks(targetPtIdx);
  }

  // 여기 잘 고칠것.
  updateLinks(idx: number): void {
    const point = this.#points[idx];
    const leftPt = this.#points[idx - 1];
    const rightPt = this.#points[idx + 1];
    if (leftPt instanceof BezierPoint) {
      leftPt.nextPt = point;
      if (!leftPt.nextCp.isInitialized)
        leftPt.nextCp.initializeCoordFromAbsCoord();
    }
    if (rightPt instanceof BezierPoint) {
      rightPt.prevPt = point;
      if (!rightPt.prevCp.isInitialized)
        rightPt.prevCp.initializeCoordFromAbsCoord();
    }
    if (point instanceof BezierPoint) {
      point.prevPt = leftPt;
      if (!point.prevCp.isInitialized)
        point.prevCp.initializeCoordFromAbsCoord();
      point.nextPt = rightPt;
      if (!point.nextCp.isInitialized)
        point.nextCp.initializeCoordFromAbsCoord();
    }
  }

  // 패스 초기화
  static fromArray(pathsArray: number[][]): FnPaths {
    const path = new FnPaths();
    pathsArray?.forEach((aPointArray) => {
      if (aPointArray.length === 2) {
        path.addPoint(new LinearPoint(aPointArray as Coord));
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
