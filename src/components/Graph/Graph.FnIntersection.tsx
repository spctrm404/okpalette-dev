import React, { useEffect, useMemo, useState } from 'react';
import { clamp } from '@/utils';
import { useFnPathsContext } from '@/contexts/FnPaths';
import { usePaths } from '@/hooks/FnPaths';
import { useGraphContext } from './Graph.context';

const FnIntersection = () => {
  const { fnPaths } = useFnPathsContext();
  const pathProps = usePaths(fnPaths)!;

  const { coordToPos, posToCoord, posBound, observable } = useGraphContext();
  const [x, setX] = useState<number>(0);
  useEffect(() => {
    const unsubscribe = observable.subscribe((props) => {
      const [posX] = props.pointerPos;
      const [[minPosX], [maxPosX]] = posBound;
      const clampedPosX = clamp(posX, minPosX, maxPosX);
      const [x] = posToCoord([clampedPosX, 0]);
      setX(x);
    });
    return () => {
      unsubscribe();
    };
  }, [posBound, observable, posToCoord]);

  const dStr = useMemo(() => {
    const { fn: evaluate } = pathProps;
    const y = evaluate(x);
    const [posX, posY] = coordToPos([x, y!]);
    const [[minPosX, minPosY]] = posBound;
    const dStr = `M${posX},${minPosY} L${posX},${posY} L${minPosX},${posY}`;
    return dStr;
  }, [coordToPos, pathProps, posBound, x]);

  return (
    <>
      <path
        d={dStr}
        fill="none"
        stroke="black"
        strokeWidth={2}
        strokeDasharray="4 2"
      />
    </>
  );
};

export default React.memo(FnIntersection);
