import Point from './Point';
import BezierPoint from './BezierPoint';
import ExponentPoint from './ExponentPoint';

export type PointTypes = Point | BezierPoint | ExponentPoint;
export type Points = PointTypes[];

class Path {
  #points: Points;
  constructor() {
    this.#points = [];
  }

  getPoint(idx: number): PointTypes | null {
    if (idx < 0 || idx >= this.#points.length) return null;
    return this.#points[idx];
  }

  addPoint(point: PointTypes, idx?: number): void {
    if (idx === undefined) {
      this.#points.push(point);
      this.updateBezierLinks(this.#points.length - 1);
    } else if (idx >= 0 && idx <= this.#points.length) {
      this.#points.splice(idx, 0, point);
      this.updateBezierLinks(idx);
    }
  }

  changePointType(point: PointTypes, idx: number): void {
    if (idx < 0 || idx >= this.#points.length) return;
    const { uuid } = this.#points[idx];
    point.uuid = uuid;
    this.#points[idx] = point;
    this.updateBezierLinks(idx);
  }

  updateBezierLinks(idx: number): void {
    if (idx < 0 || idx >= this.#points.length) return;
    const point = this.#points[idx];
    const leftPt = idx === 0 ? null : this.#points[idx - 1];
    const rightPt =
      idx === this.#points.length - 1 ? null : this.#points[idx + 1];
    if (leftPt instanceof BezierPoint) leftPt.nextPt = point;
    if (rightPt instanceof BezierPoint) rightPt.prevPt = point;
    if (point instanceof BezierPoint) {
      point.prevPt = leftPt;
      point.nextPt = rightPt;
    }
  }
}

export default Path;
