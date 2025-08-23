import type { Coord, PointObsProps } from './FnPath.type';
import { Observable } from '@/models/Observable';

export class Point<T extends PointObsProps = PointObsProps>
  extends Observable<T>
  implements PointObsProps
{
  constructor(coord: Coord) {
    const initial: T = {
      coord,
      id: crypto.randomUUID(),
    } as T;
    super(initial);
  }

  get coord(): Coord {
    return this.observable.coord;
  }
  set coord(coord: Coord) {
    this.observable = {
      ...this.observable,
      coord,
    };
  }

  get id(): string {
    return this.observable.id;
  }
  set id(id: string) {
    this.observable = {
      ...this.observable,
      id,
    };
  }

  static add([ax, ay]: Coord, [bx, by]: Coord): Coord {
    return [ax + bx, ay + by];
  }
  static sub([ax, ay]: Coord, [bx, by]: Coord): Coord {
    return [ax - bx, ay - by];
  }
}
