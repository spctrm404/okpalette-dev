import type {
  AnyFnPtInstance,
  FnPoints,
  FnPath,
  FnPathsObsProps,
  ArryPath,
} from './FnPaths.type';
import { Observable } from '@/models/Observable';
import { LinearPoint } from './LinearPoint';
import { BezierPoint } from './BezierPoint';
import { ExponentialPoint } from './ExponentialPoint';
import { getYOnCubicBezier, map } from '@/utils';

export class FnPaths extends Observable<FnPathsObsProps> {
  #points: FnPoints;

  constructor() {
    super({
      isInDomain: (x) => this.isInDomain(x),
      fn: (x) => this.fn(x),
    });
    this.#points = [];
  }

  get points(): FnPoints {
    return this.#points;
  }

  get pointCnt(): number {
    return this.#points.length;
  }

  get pathCnt(): number {
    return this.#points.length - 1;
  }

  getPointByIdx(idx: number): AnyFnPtInstance | undefined {
    return this.#points[idx];
  }
  getPointById(id: string): AnyFnPtInstance | undefined {
    return this.#points.find((pt) => pt.id === id);
  }

  getPath(idx: number): FnPath | undefined {
    const beginPt = this.getPointByIdx(idx);
    const endPt = this.getPointByIdx(idx + 1);
    if (!beginPt || !endPt) return;
    return [beginPt, endPt];
  }

  getPointIdx(point: AnyFnPtInstance): number {
    return this.#points.indexOf(point);
  }

  addPoint(point: AnyFnPtInstance, idx?: number): void {
    point.subscribe(() => {
      this.notify();
    });
    if (point instanceof BezierPoint) {
      point.prevCp.subscribe(() => {
        this.notify();
      });
      point.nextCp.subscribe(() => {
        this.notify();
      });
    }

    if (idx !== undefined && idx >= 0 && idx <= this.pointCnt)
      this.points.splice(idx, 0, point);
    else this.points.push(point);

    const pointIdx = this.getPointIdx(point);
    this.updateLinks(pointIdx);
  }

  removePoint(targetPt: AnyFnPtInstance): void {
    const targetPtIdx = this.getPointIdx(targetPt);
    if (targetPtIdx < 0) return;
    const leftPt = this.getPointByIdx(targetPtIdx - 1);
    const rightPt = this.getPointByIdx(targetPtIdx + 1);
    if (targetPt instanceof BezierPoint) {
      targetPt.prevCp.unsubscribeAll();
      targetPt.nextCp.unsubscribeAll();
    }
    targetPt.unsubscribeAll();
    this.points.splice(targetPtIdx, 1);
    if (leftPt) {
      leftPt.nextPt = rightPt;
      if (leftPt instanceof BezierPoint && !leftPt.nextCp.isInitialized)
        leftPt.nextCp.initializeCoordFromAbsCoord();
    }
    if (rightPt) {
      rightPt.prevPt = leftPt;
      if (rightPt instanceof BezierPoint && !rightPt.prevCp.isInitialized)
        rightPt.prevCp.initializeCoordFromAbsCoord();
    }
  }

  overridePoint(targetPt: AnyFnPtInstance, newPt: AnyFnPtInstance): void {
    const targetPtIdx = this.getPointIdx(targetPt);
    if (targetPtIdx < 0) return;
    const { id: oldId } = targetPt;
    newPt.id = oldId;
    newPt.subscribe(() => {
      this.notify();
    });
    if (newPt instanceof BezierPoint) {
      newPt.prevCp.subscribe(() => {
        this.notify();
      });
      newPt.nextCp.subscribe(() => {
        this.notify();
      });
    }
    if (targetPt instanceof BezierPoint) {
      targetPt.prevCp.unsubscribeAll();
      targetPt.nextCp.unsubscribeAll();
    }
    targetPt.unsubscribeAll();
    this.points[targetPtIdx] = newPt;
    this.updateLinks(targetPtIdx);
  }

  private updateLinks(idx: number): void {
    const point = this.getPointByIdx(idx);
    const leftPt = this.getPointByIdx(idx - 1);
    const rightPt = this.getPointByIdx(idx + 1);
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

  isInDomain(x: number): boolean {
    return (
      x >= this.getPointByIdx(0)!.coord[0] &&
      x <= this.getPointByIdx(this.pointCnt - 1)!.coord[0]
    );
  }

  private findPathIdxForX(x: number): number | undefined {
    if (!this.isInDomain(x)) return;
    for (let pathIdx = 0; pathIdx < this.pathCnt; pathIdx++) {
      const startPt = this.getPointByIdx(pathIdx)!;
      const endPt = this.getPointByIdx(pathIdx + 1)!;
      if (x >= startPt.coord[0] && x <= endPt.coord[0]) return pathIdx;
    }
  }

  fn(x: number): number | undefined {
    const pathIdx = this.findPathIdxForX(x);
    if (pathIdx === undefined) return;

    const [beginPt, endPt] = this.getPath(pathIdx)!;
    const beginCoord = beginPt.coord;
    const endCoord = endPt.coord;
    const [beginX, beginY] = beginCoord;
    const [endX, endY] = endCoord;
    if (x === beginX) return beginY;
    if (x === endX) return endY;

    if (beginPt instanceof ExponentialPoint) {
      const normalizedX = map(x, beginX, endX, 0, 1);
      const normalizedY = Math.pow(normalizedX, beginPt.exponent);
      const y = map(normalizedY, 0, 1, beginY, endY);
      return y;
    }
    if (beginPt instanceof BezierPoint || endPt instanceof BezierPoint) {
      const cp1 = beginPt instanceof BezierPoint ? beginPt.nextCp : undefined;
      const cp2 = endPt instanceof BezierPoint ? endPt.prevCp : undefined;
      const cp1Coord = cp1 ? cp1.absCoord : beginCoord;
      const cp2Coord = cp2 ? cp2.absCoord : endCoord;
      const y = getYOnCubicBezier(x, beginCoord, cp1Coord, cp2Coord, endCoord);
      return y;
    }
    const y = map(x, beginX, endX, beginY, endY);
    return y;
  }

  static fromArray(arryPath: ArryPath): FnPaths {
    const fnPaths = new FnPaths();
    arryPath?.forEach((aPointArray) => {
      if (aPointArray.length === 2) {
        const [x, y] = aPointArray;
        fnPaths.addPoint(new LinearPoint([x, y]));
      } else if (aPointArray.length === 3) {
        const [x, y, exponent] = aPointArray;
        fnPaths.addPoint(new ExponentialPoint([x, y], exponent));
      } else if (aPointArray.length === 6) {
        const [x, y, pcpX, pcpY, ncpX, ncpY] = aPointArray;
        fnPaths.addPoint(new BezierPoint([x, y], [pcpX, pcpY], [ncpX, ncpY]));
      }
    });
    return fnPaths;
  }
}
