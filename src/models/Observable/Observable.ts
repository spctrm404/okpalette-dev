export interface Observer<T> {
  update: (props: T) => void;
}

export interface Subject<T> {
  subscribe: (observer: Observer<T>) => () => void;
  unsubscribe: (observer: Observer<T>) => void;
  unsubscribeAll: () => void;
  notify: () => void;
}

export class Observable<T> implements Subject<T> {
  #observers: Observer<T>[];
  #props: T;

  constructor(props: T) {
    this.#observers = [];
    this.#props = props;
  }

  get observers() {
    return this.#observers;
  }
  subscribe(observer: Observer<T>) {
    this.#observers.push(observer);
    return () => {
      this.unsubscribe(observer);
    };
  }
  unsubscribe(observer: Observer<T>) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }
  unsubscribeAll(): void {
    this.#observers = [];
  }
  notify() {
    this.#observers.forEach((observer) => observer.update({ ...this.props }));
  }

  get props(): T {
    return this.#props;
  }
  set props(props: T) {
    this.#props = props;
    this.notify();
  }
}
