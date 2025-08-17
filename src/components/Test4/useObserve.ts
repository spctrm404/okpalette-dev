import { useEffect, useState } from 'react';
import { Observable } from './Observable';

export function useObserve<T>(observable: Observable<T>) {
  const [state, setState] = useState(observable.value);
  useEffect(() => {
    const update = (newValue: T) => {
      setState(newValue);
    };
    observable.subscribe({ update });
    return () => {
      observable.unsubscribe({ update });
    };
  }, [observable]);
  return state;
}
