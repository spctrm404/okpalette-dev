import type { Observer } from '../Observable';
import { ExponentialPoint } from './ExponentialPoint';
import type { AnyPoint, Path } from './FnPath.type';
import { map } from '@/utils';

export type BeginPtObserver = Observer<FnPath['beginPt']['state']>;
export type EndPtObserver = Observer<FnPath['endPt']['state']>;
export type FnPathObserver = [BeginPtObserver, EndPtObserver];

export class FnPath {
  #beginPt: AnyPoint;
  #beginPtObservers: BeginPtObserver[];
  #endPt: AnyPoint;
  #endPtObservers: EndPtObserver[];

  constructor(beginPt: AnyPoint, endPt: AnyPoint) {
    this.#beginPt = beginPt;
    this.#endPt = endPt;
    this.#beginPtObservers = [];
    this.#endPtObservers = [];
  }

  get points(): Path {
    return [this.#beginPt, this.#endPt];
  }

  get beginPt(): AnyPoint {
    return this.#beginPt;
  }
  get endPt(): AnyPoint {
    return this.#endPt;
  }

  set beginPt(beginPt: AnyPoint) {
    if (this.#beginPtObservers.length > 0)
      this.#beginPtObservers.forEach((anObserver) => {
        beginPt.subscribe(anObserver);
        this.#beginPt.unsubscribe(anObserver);
      });
    this.#beginPt = beginPt;
  }
  set endPt(endPt: AnyPoint) {
    if (this.#endPtObservers.length > 0)
      this.#endPtObservers.forEach((anObserver) => {
        endPt.subscribe(anObserver);
        this.#endPt.unsubscribe(anObserver);
      });
    this.#endPt = endPt;
  }

  isInRange(x: number): boolean {
    const [beginX] = this.beginPt.coord;
    const [endX] = this.endPt.coord;
    return x >= beginX && x <= endX;
  }

  fnVal(x: number): number | undefined {
    if (!this.isInRange(x)) return;
    if (this.beginPt instanceof ExponentialPoint) {
      const exponent = this.beginPt.exponent;
      const normalizedX = map(
        x,
        this.#beginPt.coord[0],
        this.#endPt.coord[0],
        0,
        1
      );
      const y = Math.pow(normalizedX, exponent);
      const mappedY = map(
        y,
        0,
        1,
        this.#beginPt.coord[1],
        this.#endPt.coord[1]
      );
      return mappedY;
    }
  }

  subscribeBeginPt(observer: BeginPtObserver) {
    this.#beginPtObservers.push(observer);
    this.beginPt.subscribe(observer);
  }
  subscribeEndPt(observer: EndPtObserver) {
    this.#endPtObservers.push(observer);
    this.endPt.subscribe(observer);
  }

  unsubscribeBeginPt(observer: BeginPtObserver) {
    this.#beginPtObservers = this.#beginPtObservers.filter(
      (obs) => obs !== observer
    );
    this.beginPt.unsubscribe(observer);
  }
  unsubscribeEndPt(observer: EndPtObserver) {
    this.#endPtObservers = this.#endPtObservers.filter(
      (obs) => obs !== observer
    );
    this.endPt.unsubscribe(observer);
  }

  unsubscribeAllBeginPt() {
    const beginPtObservers = this.#beginPtObservers;
    beginPtObservers.forEach((observer) => {
      this.beginPt.unsubscribe(observer);
    });
    this.#beginPtObservers = [];
  }
  unsubscribeAllEndPt() {
    const endPtObservers = this.#endPtObservers;
    endPtObservers.forEach((observer) => {
      this.endPt.unsubscribe(observer);
    });
    this.#endPtObservers = [];
  }
  unsubscribeAll() {
    this.unsubscribeAllBeginPt();
    this.unsubscribeAllEndPt();
  }
}
