import type { Observer, Subject } from './Observer';

export class ObservableStore implements Subject {
  #observers: Observer[] = [];
  #state: unknown = 0;

  attach(observer: Observer) {
    this.#observers.push(observer);
  }

  detach(observer: Observer) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }

  notify() {
    this.#observers.forEach((observer) => observer.update());
  }

  set state(newState: unknown) {
    this.#state = newState;
    this.notify();
  }

  get state() {
    return this.#state;
  }
}
