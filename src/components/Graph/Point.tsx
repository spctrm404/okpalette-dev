import type { PointInstance } from '@/models/Paths';
import { BezierPoint } from '@/models/Paths';
import Thumb from './Thumb';
import { useGraph } from './Graph.context';
import { usePoint } from '@/hooks/Paths/usePoint';
import { useMemo } from 'react';

type PointProps = {
  point: PointInstance;
  idx: number;
};

const Point = ({ point, idx }: PointProps) => {
  const prevCp = point instanceof BezierPoint ? point.prevCp : null;
  const nextCp = point instanceof BezierPoint ? point.nextCp : null;

  const trgPt = usePoint(point);
  const trgPrevCp = usePoint(prevCp);
  const trgNextCp = usePoint(nextCp);

  const { coordToPos } = useGraph();

  const pos = coordToPos(point.coord);

  const controlPt = useMemo(() => {
    if (prevCp?.isActive || nextCp?.isActive) {
      const [prevCpPosX, prevCpPosY] = prevCp?.isActive
        ? coordToPos(prevCp.absCoord)
        : pos;
      const [nextCpPosX, nextCpPosY] = nextCp?.isActive
        ? coordToPos(nextCp.absCoord)
        : pos;
      return (
        <>
          {prevCp?.isActive && (
            <path
              d={`M${pos[0]},${pos[1]} L${prevCpPosX},${prevCpPosY}`}
              stroke="blue"
            />
          )}
          {nextCp?.isActive && (
            <path
              d={`M${pos[0]},${pos[1]} L${nextCpPosX},${nextCpPosY}`}
              stroke="blue"
            />
          )}
          {prevCp?.isActive && (
            <Thumb
              val={prevCp.absCoord}
              onMoving={(newVal) => {
                prevCp.absCoord = newVal;
              }}
            />
          )}
          {nextCp?.isActive && (
            <Thumb
              val={nextCp.absCoord}
              onMoving={(newVal) => {
                nextCp.absCoord = newVal;
              }}
            />
          )}
        </>
      );
    }
    return null;
  }, [pos, nextCp, prevCp, coordToPos, trgPt, trgPrevCp, trgNextCp]);

  return (
    <>
      {controlPt}
      <Thumb
        val={point.coord}
        tabIndex={idx}
        onMoving={(newVal) => {
          point.coord = newVal;
        }}
      />
    </>
  );
};

export default Point;
