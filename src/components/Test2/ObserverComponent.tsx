import { useEffect, useState } from 'react';
import Observable from './Observable'; // Importing the subject

type prop = {
  observable: Observable<number>;
};

const ObserverComponent = ({ observable }: prop) => {
  const [state, setState] = useState(observable.value);

  useEffect(() => {
    const update = (newValue: number) => {
      setState(newValue);
    };
    observable.subscribe({ update });
    return () => observable.unsubscribe({ update });
  }, [observable]);

  return (
    <div>
      <h1>Current State: {state}</h1>
    </div>
  );
};

export default ObserverComponent;
