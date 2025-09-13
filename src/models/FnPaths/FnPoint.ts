import type { Vec2 } from '@/types';
import { clamp } from '@/utils';
import type { AnyFnPtInstance, FnPtObsProps } from './FnPaths.type';
import { Point } from './Point';

export class FnPoint<T extends FnPtObsProps = FnPtObsProps> extends Point<T> {
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
    if (!this.prevPt || !this.nextPt)
      return [this.#initialCoord[0], this.#initialCoord[0]];
    return [this.prevPt.coord[0], this.nextPt.coord[0]];
  }
}
