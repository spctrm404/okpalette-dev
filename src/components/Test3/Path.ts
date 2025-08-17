import type { Observer, Subscribable } from './Observable';
import { Point, type PointValue } from './Point';

export class Path implements Subscribable<PointValue> {
  #points: [Point, Point];

  constructor(beginPoint: Point, endPoint: Point) {
    this.#points = [beginPoint, endPoint];
  }

  get points(): [Point, Point] {
    return this.#points;
  }

  get beginPt(): Point {
    return this.#points[0];
  }

  get endPt(): Point {
    return this.#points[1];
  }

  subscribe(observer: Observer<PointValue>) {
    this.beginPt.subscribe(observer);
    this.endPt.subscribe(observer);
  }

  unsubscribe(observer: Observer<PointValue>) {
    this.beginPt.unsubscribe(observer);
    this.endPt.unsubscribe(observer);
  }
}
