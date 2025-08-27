import type { Vec2 } from '@/types';
import type { PointObsProps } from './FnPath.type';
import { Observable } from '@/models/Observable';

export class Point<
  T extends PointObsProps = PointObsProps
> extends Observable<T> {
  #coord: Vec2;
  #id: string;

  constructor(coord: Vec2) {
    const initial: T = {
      getCoord: () => this.coord,
      getId: () => this.id,
    } as T;
    super(initial);
    this.#coord = coord;
    this.#id = crypto.randomUUID();
  }

  get coord(): Vec2 {
    return this.#coord;
  }
  set coord(coord: Vec2) {
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

  static add([ax, ay]: Vec2, [bx, by]: Vec2): Vec2 {
    return [ax + bx, ay + by];
  }
  static sub([ax, ay]: Vec2, [bx, by]: Vec2): Vec2 {
    return [ax - bx, ay - by];
  }
}
