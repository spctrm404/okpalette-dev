import { usePaths } from '@/hooks/FnPaths';
import type { FnPaths } from '@/models/FnPaths';
import { useCallback, useMemo, useState } from 'react';
import { useGraph } from './Graph.context';

type FnProps = {
  paths: FnPaths;
};

const Fn = ({ paths }: FnProps) => {
  const pathProps = usePaths(paths)!;
  const { coordToPos, posToCoord, posBound } = useGraph();

  const [xState, setX] = useState<number | undefined>(undefined);
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const { offsetX, offsetY } = e.nativeEvent;
      const [x] = posToCoord([offsetX, offsetY]);
      setX(x);
    },
    [posToCoord]
  );

  const d = useMemo(() => {
    const { evaluate } = pathProps;
    const y = evaluate(xState!);
    const [posX, posY] = coordToPos([xState!, y!]);
    const [[minPosX, minPosY]] = posBound;
    const dStr = `M${posX},${minPosY} L${posX},${posY} L${minPosX},${posY}`;
    return dStr;
  }, [pathProps, coordToPos, posBound, xState]);

  const [[minPosX, minPosY], [maxPosX, maxPosY]] = posBound;

  return (
    <>
      <rect
        x={minPosX}
        y={maxPosY}
        width={maxPosX - minPosX}
        height={minPosY - maxPosY}
        fill="transparent"
        stroke="none"
        onPointerMove={handlePointerMove}
      />
      {xState !== undefined ? (
        <path
          d={d}
          fill="none"
          stroke="black"
          strokeWidth={2}
          strokeDasharray="4 2"
        />
      ) : null}
    </>
  );
};

export default Fn;
