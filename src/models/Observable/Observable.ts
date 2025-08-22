export interface Observer<T> {
  (subject: T): void;
}

export interface ISubject<T> {
  subscribe: (observer: Observer<T>) => void;
  unsubscribe: (observer: Observer<T>) => void;
  unsubscribeAll: () => void;
  notify: () => void;
}

export class Subject<T> implements ISubject<T> {
  #observers: Observer<T>[];

  constructor() {
    this.#observers = [];
  }

  get observers() {
    return this.#observers;
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
    this.#observers.forEach((observer) => observer(this as unknown as T));
  }
}
