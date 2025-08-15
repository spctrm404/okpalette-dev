import type { Vec2 } from '@/types';

export class Point {
  #x: number;
  #y: number;
  #uuid: string;
  #listeners: Set<() => void>;

  constructor([x, y]: Vec2) {
    this.#x = x;
    this.#y = y;
    this.#uuid = crypto.randomUUID();
    this.#listeners = new Set<() => void>();
  }

  get coord(): Vec2 {
    return [this.#x, this.#y];
  }
  set coord([x, y]: Vec2) {
    this.#x = x;
    this.#y = y;
    this._emit();
  }

  get uuid(): string {
    return this.#uuid;
  }
  set uuid(uuid: string) {
    this.#uuid = uuid;
  }

  subscribe(fn: () => void): () => void {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }
  _emit() {
    for (const fn of Array.from(this.#listeners)) {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    }
  }

  static add([ax, ay]: Vec2, [bx, by]: Vec2): Vec2 {
    return [ax + bx, ay + by];
  }
  static sub([ax, ay]: Vec2, [bx, by]: Vec2): Vec2 {
    return [ax - bx, ay - by];
  }
}
