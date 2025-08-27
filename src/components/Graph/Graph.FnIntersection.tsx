import { usePaths } from '@/hooks/FnPaths';
import type { FnPaths } from '@/models/FnPaths';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGraph } from './Graph.context';
import { clamp } from '@/utils';
import type { GraphObservable } from './Graph.Observable';

type FnProps = {
  paths: FnPaths;
  graphObservable: GraphObservable;
};

const FnIntersection = ({ paths, graphObservable }: FnProps) => {
  const pathProps = usePaths(paths)!;
  const { coordToPos, posToCoord, paddedSize, posBoundary } = useGraph();

  const [paddedWidth, paddedHeight] = paddedSize;
  const [[minPosX, minPosY], [maxPosX, maxPosY]] = posBoundary;

  const [xState, setXState] = useState<number>(0);
  const [isHoveredState, setIsHoveredState] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = graphObservable.subscribe((props) => {
      console.log('update');
      const [posX] = props.getMousePos();
      const clampedPosX = clamp(posX, minPosX, maxPosX);
      const [x] = posToCoord([clampedPosX, 0]);
      setXState(x);
      setIsHoveredState(props.isHovered());
    });
    return () => {
      unsubscribe();
    };
  }, [graphObservable, minPosX, maxPosX, posToCoord]);

  const d = useMemo(() => {
    const { evaluate } = pathProps;
    const y = evaluate(xState);
    const [posX, posY] = coordToPos([xState, y!]);
    const dStr = `M${posX},${minPosY} L${posX},${posY} L${minPosX},${posY}`;
    return dStr;
  }, [coordToPos, minPosX, minPosY, pathProps, xState]);

  return (
    <>
      <rect
        x={minPosX}
        y={maxPosY}
        width={Math.max(paddedWidth, 0)}
        height={Math.max(paddedHeight, 0)}
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

export default FnIntersection;
