import type { Vec2 } from '@/types';
import type { AnyFnPtInstance, FnPtObsProps } from './FnPaths.type';
import { Point } from './Point';
import { clamp } from '@/utils';

export class FnPoint<T extends FnPtObsProps> extends Point<T> {
  #initialCoord: Vec2;
  #prevPt: AnyFnPtInstance | undefined;
  #nextPt: AnyFnPtInstance | undefined;

  constructor(coord: Vec2) {
    super(coord);
    this.#initialCoord = coord;
    this.#prevPt = undefined;
    this.#nextPt = undefined;
    this.props = {
      getPrevPt: () => this.prevPt,
      getNextPt: () => this.nextPt,
      getRangeX: () => this.rangeX,
    } as Partial<T>;
  }

  get coord(): Vec2 {
    return super.coord;
  }
  set coord(coord: Vec2) {
    const [x, y] = coord;
    const [minX, maxX] = this.rangeX;
    super.coord = [clamp(x, minX, maxX), y];
  }

  get prevPt(): AnyFnPtInstance | undefined {
    return this.#prevPt;
  }
  get nextPt(): AnyFnPtInstance | undefined {
    return this.#nextPt;
  }

  set prevPt(prevPt: AnyFnPtInstance | undefined) {
    this.#prevPt = prevPt;
    this.notify();
  }
  set nextPt(nextPt: AnyFnPtInstance | undefined) {
    this.#nextPt = nextPt;
    this.notify();
  }

  get rangeX(): Vec2 {
    if (!this.prevPt || !this.nextPt) {
      const [initialX] = this.#initialCoord;
      return [initialX, initialX];
    }
    const [prevX] = this.prevPt.coord;
    const [nextX] = this.nextPt.coord;
    return [prevX, nextX];
  }
}
