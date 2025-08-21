import type { Coord, PointProp, Range } from './FnPath.type';
import { Subject } from '@/models/Observable';

export class Point<T extends PointProp = PointProp> extends Subject<T> {
  constructor(initialState: T) {
    super(initialState);
    this.state.uuid = crypto.randomUUID();
  }

  get coord(): Coord {
    return this.state.coord;
  }
  set coord(coord: Coord) {
    this.state.coord = coord;
    this.notify();
  }

  get id(): string {
    return this.state.uuid!;
  }
  set id(id: string) {
    this.state.uuid = id;
    this.notify();
  }

  get rangeX(): Range | undefined {
    return this.state.rangeX;
  }
  set rangeX(rangeX: Range | undefined) {
    this.state.rangeX = rangeX;
    this.notify();
  }

  static add([ax, ay]: Coord, [bx, by]: Coord): Coord {
    return [ax + bx, ay + by];
  }
  static sub([ax, ay]: Coord, [bx, by]: Coord): Coord {
    return [ax - bx, ay - by];
  }
}
