import { Observable } from './Observable';

export type PointValue = [number, number];

export class Point extends Observable<PointValue> {
  constructor(coord: PointValue) {
    super(coord);
  }

  get x(): number {
    return this.value[0];
  }
  set x(x: number) {
    this.value = [x, this.value[1]];
  }

  get y(): number {
    return this.value[1];
  }
  set y(y: number) {
    this.value = [this.value[0], y];
  }
}
