export interface Observer<T> {
  update: (state: T) => void;
}

export interface ISubject<T> {
  state: T;
  subscribe: (observer: Observer<T>) => void;
  unsubscribe: (observer: Observer<T>) => void;
  unsubscribeAll: () => void;
  notify: () => void;
}

export class Subject<T> implements ISubject<T> {
  #observers: Observer<T>[];
  #state: T;

  constructor(initialState: T) {
    this.#observers = [];
    this.#state = initialState;
  }

  get observers() {
    return this.#observers;
  }

  get state() {
    return this.#state;
  }
  set state(newState: T) {
    this.#state = newState;
    this.notify();
  }

  subscribe(observer: Observer<T>) {
    this.#observers.push(observer);
  }

  unsubscribe(observer: Observer<T>) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }

  unsubscribeAll(): void {
    this.#observers = [];
  }

  notify() {
    this.#observers.forEach((observer) => observer.update(this.#state));
  }
}
