import { usePaths } from '@/hooks/FnPaths';
import type { FnPaths } from '@/models/FnPaths';
import { useCallback, useMemo, useState } from 'react';
import { useGraph } from './Graph.context';
import { clamp } from '@/utils';

type FnProps = {
  paths: FnPaths;
};

const FnIntersection = ({ paths }: FnProps) => {
  const pathProps = usePaths(paths)!;
  const { coordToPos, posToCoord, paddedSize, posBoundary } = useGraph();

  const [paddedWidth, paddedHeight] = paddedSize;
  const [[minPosX, minPosY], [maxPosX, maxPosY]] = posBoundary;

  const [xState, setXState] = useState<number | undefined>(undefined);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      console.log('Pointer moved');
      const { offsetX } = e.nativeEvent;
      const clampedPosX = clamp(offsetX, minPosX, maxPosX);
      const [x] = posToCoord([clampedPosX, 0]);
      setXState(x);
    },
    [maxPosX, minPosX, posToCoord]
  );

  const d = useMemo(() => {
    if (xState === undefined) return;
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
        onPointerMove={handlePointerMove}
      />
      {d !== undefined && (
        <path
          d={d}
          fill="none"
          stroke="black"
          strokeWidth={2}
          strokeDasharray="4 2"
        />
      )}
    </>
  );
};

export default FnIntersection;
