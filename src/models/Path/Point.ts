import type { Vec2 } from '@TYPES/index';

class Point {
  #x: number;
  #y: number;
  #uuid: string;

  constructor([x, y]: Vec2) {
    this.#x = x;
    this.#y = y;
    this.#uuid = crypto.randomUUID();
  }

  get coord(): Vec2 {
    return [this.#x, this.#y];
  }
  set coord([x, y]: Vec2) {
    this.#x = x;
    this.#y = y;
  }

  get uuid(): string {
    return this.#uuid;
  }
  set uuid(uuid: string) {
    this.#uuid = uuid;
  }

  static add([ax, ay]: Vec2, [bx, by]: Vec2): Vec2 {
    return [ax + bx, ay + by];
  }
  static sub([ax, ay]: Vec2, [bx, by]: Vec2): Vec2 {
    return [ax - bx, ay - by];
  }
}

export default Point;
