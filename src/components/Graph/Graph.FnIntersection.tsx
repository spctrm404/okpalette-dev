import React, { useEffect, useMemo, useState } from 'react';
import type { FnPaths } from '@/models/FnPaths';
import { usePaths } from '@/hooks/FnPaths';
import { clamp } from '@/utils';
import { useGraph } from './Graph.context';

type FnProps = {
  paths: FnPaths;
};

const FnIntersection = ({ paths }: FnProps) => {
  const pathProps = usePaths(paths)!;
  const { coordToPos, posToCoord, padding, paddedSize, posBound, observable } =
    useGraph();

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

  const d = useMemo(() => {
    const { evaluate } = pathProps;
    const y = evaluate(x);
    const [posX, posY] = coordToPos([x, y!]);
    const [[minPosX, minPosY]] = posBound;
    const dStr = `M${posX},${minPosY} L${posX},${posY} L${minPosX},${posY}`;
    return dStr;
  }, [coordToPos, pathProps, posBound, x]);

  return (
    <>
      <rect
        x={padding}
        y={padding}
        width={Math.max(paddedSize[0], 0)}
        height={Math.max(paddedSize[1], 0)}
        fill="transparent"
        stroke="none"
      />
      <path
        d={d}
        fill="none"
        stroke="black"
        strokeWidth={2}
        strokeDasharray="4 2"
      />
    </>
  );
};

export default React.memo(FnIntersection);
