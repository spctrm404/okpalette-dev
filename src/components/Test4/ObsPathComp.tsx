import { useEffect, useReducer, useState } from 'react';
import type { AnyPoint } from '@/models/FnPath';
import { BezierPoint, ExponentialPoint, LinearPoint } from '@/models/FnPath';

type prop = {
  beginPt: AnyPoint;
  endPt: AnyPoint;
  idx: number;
};

const ObsPathComp = ({ beginPt, endPt, idx }: prop) => {
  console.log('render ObsPathComp', idx);
  const [render, setRender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const updateBeginPt = () => {
      setRender();
    };
    const updateEndPt = () => {
      setRender();
    };
    beginPt.subscribe(updateBeginPt);
    endPt.subscribe(updateEndPt);
    return () => {
      beginPt.unsubscribe(updateBeginPt);
      endPt.unsubscribe(updateEndPt);
    };
  }, [beginPt, endPt]);

  return (
    <div>
      <p>ObsPathComp {idx}</p>
      <p>
        {beginPt instanceof BezierPoint
          ? 'Bezier'
          : beginPt instanceof ExponentialPoint
          ? 'Exponential'
          : 'Linear'}
      </p>
      <p>Begin Point: {JSON.stringify(beginPt.coord)}</p>
      <p>End Point: {JSON.stringify(endPt.coord)}</p>
    </div>
  );
};

export default ObsPathComp;
