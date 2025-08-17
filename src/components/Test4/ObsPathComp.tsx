import { useEffect, useState } from 'react';
import { Path } from './Path';
import type { PointValue } from './Point';

type prop = {
  path: Path;
  idx: number;
};

const ObsPathComp = ({ path, idx }: prop) => {
  console.log('render ObsPathComp', idx);

  const [beginPt, endPt] = path.points;

  const [beginPtValue, setBeginPtValue] = useState(beginPt.value);
  const [endPtValue, setEndPtValue] = useState(endPt.value);

  useEffect(() => {
    const updateBeginPt = (newValue: PointValue) => {
      setBeginPtValue(newValue);
    };
    beginPt.subscribe({ update: updateBeginPt });
    const updateEndPt = (newValue: PointValue) => {
      setEndPtValue(newValue);
    };
    endPt.subscribe({ update: updateEndPt });
    return () => {
      beginPt.unsubscribe({ update: updateBeginPt });
      endPt.unsubscribe({ update: updateEndPt });
    };
  }, [beginPt, endPt]);

  return (
    <div>
      <h1>{`${beginPtValue[0]}, ${beginPtValue[1]}`}</h1>
      <h1>{`${endPtValue[0]}, ${endPtValue[1]}`}</h1>
    </div>
  );
};

export default ObsPathComp;
