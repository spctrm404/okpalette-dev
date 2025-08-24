import { usePaths } from '@/hooks/FnPaths';
import type { FnPaths } from '@/models/FnPaths';
import { useMemo } from 'react';
import { useGraph } from './Graph.context';

type FnProps = {
  paths: FnPaths;
  x: number;
};

const Fn = ({ paths, x }: FnProps) => {
  const { coordToPos, posBound } = useGraph();
  const pathProps = usePaths(paths)!;

  const d = useMemo(() => {
    const { getFnVal } = pathProps;
    const y = getFnVal(x);
    const [posX, posY] = coordToPos([x, y]);
    const [[minPosX, minPosY]] = posBound;
    const dStr = `M${posX},${minPosY} L${posX},${posY} L${minPosX},${posY}`;
    return dStr;
  }, [coordToPos, pathProps, posBound, x]);

  return <path d={d} fill="none" stroke="black" strokeWidth={2} />;
};

export default Fn;
