import type { Coord, PointObsProps } from './FnPath.type';
import { Observable } from '@/models/Observable';

export class Point<
  T extends PointObsProps = PointObsProps
> extends Observable<T> {
  #coord: Coord;
  #id: string;

  constructor(coord: Coord) {
    const initial: T = {
      getCoord: () => this.coord,
      getId: () => this.id,
    } as T;
    super(initial);
    this.#coord = coord;
    this.#id = crypto.randomUUID();
  }

  get coord(): Coord {
    return this.#coord;
  }
  set coord(coord: Coord) {
    this.#coord = coord;
    this.notify();
  }

  get id(): string {
    return this.#id;
  }
  set id(id: string) {
    this.#id = id;
    this.notify();
  }

  static add([ax, ay]: Coord, [bx, by]: Coord): Coord {
    return [ax + bx, ay + by];
  }
  static sub([ax, ay]: Coord, [bx, by]: Coord): Coord {
    return [ax - bx, ay - by];
  }
}
