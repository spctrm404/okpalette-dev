import { Point, type PointValue } from './Point';
import { Path } from './Path';

class Paths {
  #points: Point[];
  #paths: Path[];

  constructor() {
    this.#points = [];
    this.#paths = [];
  }

  get points(): Point[] {
    return this.#points;
  }

  getPoint(idx: number): Point | undefined {
    return this.#points[idx];
  }

  addPoint(point: Point) {
    this.#points.push(point);
  }

  get pointCnt(): number {
    return this.#points.length;
  }

  get paths(): Path[] {
    return this.#paths;
  }

  getPath(idx: number): Path | undefined {
    return this.#paths[idx];
  }

  addPath(path: Path) {
    this.#paths.push(path);
  }

  get pathCnt(): number {
    return this.#paths.length;
  }

  static fromArray(pts: number[][]): Paths | undefined {
    if (pts.length < 2) return undefined;
    const paths = new Paths();
    pts.map((pt, idx) => {
      if (pt.length === 2) {
        const point = new Point(pt as PointValue);
        paths.addPoint(point);
      } else if (pt.length === 3) {
      } else if (pt.length === 6) {
      }
      if (idx > 0) {
        const prevPoint = paths.getPoint(idx - 1);
        const currPoint = paths.getPoint(idx);
        const path = new Path(prevPoint!, currPoint!);
        paths.addPath(path);
      }
    });
  }
}
