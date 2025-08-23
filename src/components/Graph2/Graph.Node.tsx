import { useMemo } from 'react';
import {
  type AnyFnPtInstance,
  type AnyFnPtObsProps,
  type ControlPtObsProps,
  type Coord,
  BezierPoint,
} from '@/models/FnPaths';
import { usePoint } from '@/hooks/FnPaths';
import { useGraph } from './Graph.context';
import Thumb from './Graph.Thumb';

type PointProps = {
  point: AnyFnPtInstance;
  idx: number;
};

const Node = ({ point, idx }: PointProps) => {
  console.log(`render: node${idx}`);

  const prevCp = point instanceof BezierPoint ? point.prevCp : undefined;
  const nextCp = point instanceof BezierPoint ? point.nextCp : undefined;

  const ptObsable = usePoint(point)! as AnyFnPtObsProps;
  const prevPtObsable = usePoint(point.prevPt);
  const nextPtObsable = usePoint(point.nextPt);
  const prevCpObsable = usePoint(prevCp) as ControlPtObsProps | undefined;
  const nextCpObsable = usePoint(nextCp) as ControlPtObsProps | undefined;

  const { coordToPos } = useGraph();

  const pos = coordToPos(ptObsable.coord);

  const controlPt = useMemo(() => {
    if (prevCpObsable?.isActive || nextCpObsable?.isActive) {
      const [prevCpPosX, prevCpPosY] = prevCpObsable?.isActive
        ? coordToPos(prevCpObsable.absCoord())
        : pos;
      const [nextCpPosX, nextCpPosY] = nextCpObsable?.isActive
        ? coordToPos(nextCpObsable.absCoord())
        : pos;
      return (
        <>
          {prevCpObsable?.isActive && (
            <path
              d={`M${pos[0]},${pos[1]} L${prevCpPosX},${prevCpPosY}`}
              stroke="blue"
            />
          )}
          {nextCpObsable?.isActive && (
            <path
              d={`M${pos[0]},${pos[1]} L${nextCpPosX},${nextCpPosY}`}
              stroke="blue"
            />
          )}
          {prevCpObsable?.isActive && (
            <Thumb
              val={prevCpObsable.absCoord()}
              onMoving={(newVal) => {
                prevCp?.setAbsCoord(newVal);
              }}
              {...(prevPtObsable && {
                constraintX: [prevPtObsable.coord[0], pos[0]] as Coord,
                constraintY: [prevPtObsable.coord[1], pos[1]] as Coord,
              })}
            />
          )}
          {nextCpObsable?.isActive && (
            <Thumb
              val={nextCpObsable.absCoord()}
              onMoving={(newVal) => {
                nextCp?.setAbsCoord(newVal);
              }}
              {...(nextPtObsable && {
                constraintX: [nextPtObsable.coord[0], pos[0]] as Coord,
                constraintY: [nextPtObsable.coord[1], pos[1]] as Coord,
              })}
            />
          )}
        </>
      );
    }
    return null;
  }, [
    coordToPos,
    prevCp,
    nextCp,
    prevPtObsable,
    nextPtObsable,
    prevCpObsable,
    nextCpObsable,
    pos,
  ]);

  return (
    <>
      {controlPt}
      <Thumb
        val={ptObsable.coord}
        tabIndex={idx}
        onMoving={(newVal) => {
          point.coord = newVal;
        }}
        constraintX={ptObsable.rangeX()}
      />
      <text x={pos[0] + 10} y={pos[1] - 10} fontSize={12} fill="black">
        {JSON.stringify(ptObsable.rangeX())}
      </text>
    </>
  );
};

export default Node;
