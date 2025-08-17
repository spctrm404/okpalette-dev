export type Observer<T> = {
  update: (state: T) => void;
};

export interface Subscribable<T> {
  subscribe: (observer: Observer<T>) => void;
  unsubscribe: (observer: Observer<T>) => void;
}

export interface Subject<T> extends Subscribable<T> {
  notify: () => void;
}

export class Observable<T> implements Subject<T> {
  #observers: Observer<T>[];
  #value: T;

  constructor(initial: T) {
    this.#observers = [];
    this.#value = initial;
  }

  get observers() {
    return this.#observers;
  }

  get value() {
    return this.#value;
  }
  set value(newValue: T) {
    this.#value = newValue;
    this.notify();
  }

  subscribe(observer: Observer<T>) {
    this.#observers.push(observer);
  }

  unsubscribe(observer: Observer<T>) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }

  notify() {
    this.#observers.forEach((observer) => observer.update(this.#value));
  }
}
