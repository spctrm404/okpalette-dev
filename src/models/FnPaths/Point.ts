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
    return this.props.coord;
  }
  set coord(coord: Coord) {
    this.props = {
      ...this.props,
      coord,
    };
  }

  get id(): string {
    return this.props.id;
  }
  set id(id: string) {
    this.props = {
      ...this.props,
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
