export interface Observer {
  update: () => void;
}

export interface Subject {
  subscribe: (observer: Observer) => () => void;
  unsubscribe: (observer: Observer) => void;
  unsubscribeAll: () => void;
  notify: () => void;
}

export class Observable<T> implements Subject {
  #observers: Observer[];
  #observable: T;

  constructor(observable: T) {
    this.#observers = [];
    this.#observable = observable;
  }

  get observers() {
    return this.#observers;
  }
  subscribe(observer: Observer) {
    this.#observers.push(observer);
    return () => {
      this.unsubscribe(observer);
    };
  }
  unsubscribe(observer: Observer) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }
  unsubscribeAll(): void {
    this.#observers = [];
  }
  notify() {
    this.#observers.forEach((observer) => observer.update());
  }

  get observable(): T {
    return this.#observable;
  }
  set observable(observable: T) {
    this.#observable = observable;
    this.notify();
  }
}
