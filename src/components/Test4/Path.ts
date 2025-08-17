import { Point } from './Point';

export class Path {
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
}
