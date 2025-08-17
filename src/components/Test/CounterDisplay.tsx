import React, { useEffect, useState } from 'react';
import type { Observer } from './Observer';
import { ObservableStore } from './ObservableStore';

interface Props {
  store: ObservableStore;
}

const CounterDisplay = ({ store }: Props) => {
  const [count, setCount] = useState(store.state);

  const observer: Observer = {
    update: () => setCount(store.state),
  };

  useEffect(() => {
    store.attach(observer);
    return () => store.detach(observer);
  }, [store]);

  return <h2>Count: {count}</h2>;
};

export default CounterDisplay;
