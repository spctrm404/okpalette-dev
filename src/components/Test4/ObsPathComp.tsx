import { useEffect, useState } from 'react';
import type { AnyFnPtInstance } from '@/models/FnPaths';

type prop = {
  beginPt: AnyFnPtInstance;
  endPt: AnyFnPtInstance;
  idx: number;
};

const ObsPathComp = ({ beginPt, endPt, idx }: prop) => {
  console.log('render ObsPathComp', idx);
  const [beginPtState, setBeginPtState] = useState(beginPt.observable);
  const [endPtState, setEndPtState] = useState(endPt.observable);

  useEffect(() => {
    const beginPtObserver = {
      update: () => {
        setBeginPtState(beginPt.observable);
      },
    };
    const endPtObserver = {
      update: () => {
        setEndPtState(endPt.observable);
      },
    };
    beginPt.subscribe(beginPtObserver);
    endPt.subscribe(endPtObserver);
    return () => {
      beginPt.unsubscribe(beginPtObserver);
      endPt.unsubscribe(endPtObserver);
    };
  }, [beginPt, endPt]);

  return (
    <div>
      <p>ObsPathComp {idx}</p>
      <p>{JSON.stringify(beginPtState)}</p>
      <p>{JSON.stringify(endPtState)}</p>
    </div>
  );
};

export default ObsPathComp;
