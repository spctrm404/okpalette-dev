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
  #props: T;

  constructor(props: T) {
    this.#observers = [];
    this.#props = props;
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

  get props(): T {
    return this.#props;
  }
  set props(props: T) {
    this.#props = props;
    this.notify();
  }
}
