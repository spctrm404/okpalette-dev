import { FnPaths } from '@/models/FnPaths';
import CtrlPointXComp from './CtrlPointXComp';
import CtrlPointYComp from './CtrlPointYComp';
import ObsPathComp from './ObsPathComp';
import { useRef } from 'react';

const Test3 = () => {
  const paths1 = useRef<FnPaths>(
    FnPaths.fromArray([
      [0, 0],
      [25, 0.5],
      [50, 0.25],
      [75, 0.75],
      [100, 1],
    ])
  ).current;
  const paths2 = useRef<FnPaths>(
    FnPaths.fromArray([
      [0, 0],
      [100, 1],
    ])
  ).current;

  console.log('paths1', paths1);
  console.log('paths2', paths2);

  return (
    <div>
      <div>
        <h1>Set1</h1>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {paths1?.points.map((aPoint, idx) => {
            if (idx < 1) return;
            return (
              <ObsPathComp
                key={`paths1-path-${idx}`}
                beginPt={aPoint.prevPt!}
                endPt={aPoint}
                idx={idx}
              />
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {paths1?.points.map((aPoint, idx) => {
            return (
              <div key={`paths1-point-${idx}`}>
                <CtrlPointXComp
                  key={`paths1-point-x-${idx}`}
                  point={aPoint}
                  idx={idx}
                />
                <CtrlPointYComp
                  key={`paths1-point-y-${idx}`}
                  point={aPoint}
                  idx={idx}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Test3;
