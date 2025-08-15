import { useMemo } from 'react';
import type { Vec2 } from '@/types';
import type { PointInstance } from '@/models/Paths';
import { BezierPoint } from '@/models/Paths';
import { usePoint } from '@/hooks/Paths';
import { useGraph } from './Graph.context';
import Thumb from './Graph.Thumb';

type PointProps = {
  point: PointInstance;
  prevPt?: PointInstance;
  nextPt?: PointInstance;
  idx: number;
};

const Node = ({ point, prevPt, nextPt, idx }: PointProps) => {
  console.log(`render: node${idx}`);

  const prevCp = point instanceof BezierPoint ? point.prevCp : null;
  const nextCp = point instanceof BezierPoint ? point.nextCp : null;

  const trgPt = usePoint(point);
  const trgPrevCp = usePoint(prevCp);
  const trgNextCp = usePoint(nextCp);
  const trgPrevPt = usePoint(prevPt || null);
  const trgNextPt = usePoint(nextPt || null);

  const { coordToPos } = useGraph();

  const pos = coordToPos(point.coord);

  const constraintX = useMemo(
    () =>
      prevPt && nextPt
        ? [prevPt.coord[0], nextPt.coord[0]]
        : [point.coord[0], point.coord[0]],
    [trgPt, trgPrevPt, trgNextPt]
  );

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
              {...(prevPt && {
                constraintX: [prevPt.coord[0], point.coord[0]] as Vec2,
                constraintY: [prevPt.coord[1], point.coord[1]] as Vec2,
              })}
            />
          )}
          {nextCp?.isActive && (
            <Thumb
              val={nextCp.absCoord}
              onMoving={(newVal) => {
                nextCp.absCoord = newVal;
              }}
              {...(nextPt && {
                constraintX: [nextPt.coord[0], point.coord[0]] as Vec2,
                constraintY: [nextPt.coord[1], point.coord[1]] as Vec2,
              })}
            />
          )}
        </>
      );
    }
    return null;
  }, [coordToPos, trgPt, trgPrevCp, trgNextCp, trgPrevPt, trgNextPt]);

  return (
    <>
      {controlPt}
      <Thumb
        val={point.coord}
        tabIndex={idx}
        onMoving={(newVal) => {
          point.coord = newVal;
        }}
        constraintX={constraintX as Vec2}
      />
    </>
  );
};

export default Node;
