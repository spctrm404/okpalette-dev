import type { Vec2 } from '@/types';
import { Point } from './Point';
import { BezierPoint } from './BezierPoint';
import { ExponentPoint } from './ExponentPoint';

export type PointInstance = Point | BezierPoint | ExponentPoint;
export type Points = PointInstance[];

export class Paths {
  #points: Points;
  #listeners: Set<() => void>;
  #pointUnsubscribeFns: Map<string, () => void>;

  constructor() {
    this.#points = [];
    this.#listeners = new Set<() => void>();
    this.#pointUnsubscribeFns = new Map<string, () => void>();
  }

  get points(): Points {
    return this.#points;
  }

  get length(): number {
    return this.#points.length;
  }

  getPoint(idx: number): PointInstance | null {
    if (idx < 0 || idx >= this.length) return null;
    return this.#points[idx];
  }

  getPointByUuid(uuid: string): PointInstance | null {
    return this.#points.find((aPoint) => aPoint.uuid === uuid) || null;
  }

  addPoint(point: PointInstance, idx?: number): void {
    if (idx === undefined) {
      this.#points.push(point);
      this.updateBezierLinks(this.length - 1);
      this.#subscribePoint(point);
    } else if (idx >= 0 && idx <= this.length) {
      this.#points.splice(idx, 0, point);
      this.updateBezierLinks(idx);
      this.#subscribePoint(point);
    }
    this.#emit();
  }

  changePointType(point: PointInstance, idx: number): void {
    if (idx < 0 || idx >= this.length) return;
    const oldPoint = this.#points[idx];
    this.#unsubscribePoint(oldPoint);

    const { uuid } = oldPoint;
    point.uuid = uuid;
    this.#points[idx] = point;
    this.updateBezierLinks(idx);
    this.#subscribePoint(point);
    this.#emit();
  }

  removePoint(idx: number): void {
    if (idx < 0 || idx >= this.length) return;
    const point = this.#points[idx];
    this.#unsubscribePoint(point);
    this.#points.splice(idx, 1);
    this.#emit();
  }

  updateBezierLinks(idx: number): void {
    if (idx < 0 || idx >= this.length) return;
    const point = this.#points[idx];
    const leftPt = idx === 0 ? null : this.#points[idx - 1];
    const rightPt = idx === this.length - 1 ? null : this.#points[idx + 1];
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

  subscribe(fn: () => void): () => void {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }
  #emit() {
    for (const fn of Array.from(this.#listeners)) {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    }
  }
  #subscribePoint(point: PointInstance) {
    const unsubscribe = point.subscribe(() => this.#emit());
    this.#pointUnsubscribeFns.set(point.uuid, unsubscribe);
  }
  #unsubscribePoint(point: PointInstance) {
    const unsubscribe = this.#pointUnsubscribeFns.get(point.uuid);
    if (unsubscribe) {
      unsubscribe();
      this.#pointUnsubscribeFns.delete(point.uuid);
    }
  }

  static fromArray(pathsArray: number[][]): Paths {
    const path = new Paths();
    pathsArray?.map((aPointArray) => {
      if (aPointArray.length === 2) {
        path.addPoint(new Point(aPointArray as Vec2));
      } else if (aPointArray.length === 3) {
        const [x, y, exponent] = aPointArray;
        path.addPoint(new ExponentPoint([x, y], exponent));
      } else if (aPointArray.length === 6) {
        const [x, y, pcpX, pcpY, ncpX, ncpY] = aPointArray;
        path.addPoint(new BezierPoint([x, y], [pcpX, pcpY], [ncpX, ncpY]));
      }
    });
    return path;
  }
}
