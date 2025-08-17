type Observer<T> = {
  update: (state: T) => void;
};

interface Subject<T> {
  subscribe: (observer: Observer<T>) => void;
  unsubscribe: (observer: Observer<T>) => void;
  notify: () => void;
}

class Observable<T> implements Subject<T> {
  _observers: Observer<T>[];
  _value: T;

  constructor(initial: T) {
    this._observers = [];
    this._value = initial;
  }

  get observers() {
    return this._observers;
  }

  get value() {
    return this._value;
  }
  set value(newValue: T) {
    this._value = newValue;
    this.notify();
  }

  subscribe(observer: Observer<T>) {
    this._observers.push(observer);
  }

  unsubscribe(observer: Observer<T>) {
    this._observers = this._observers.filter((obs) => obs !== observer);
  }

  notify() {
    this._observers.forEach((observer) => observer.update(this._value));
  }
}

export default Observable;
