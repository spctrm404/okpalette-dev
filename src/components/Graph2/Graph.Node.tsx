import { useMemo } from 'react';
import {
  type AnyFnPtInstance,
  type AnyFnPtObsProps,
  type ControlPtObsProps,
  type Range,
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
    if (prevCpObsable?.isActive() || nextCpObsable?.isActive()) {
      const [prevCpPosX, prevCpPosY] = prevCpObsable?.isActive()
        ? coordToPos(prevCpObsable.getAbsCoord())
        : pos;
      const [nextCpPosX, nextCpPosY] = nextCpObsable?.isActive()
        ? coordToPos(nextCpObsable.getAbsCoord())
        : pos;
      return (
        <>
          {prevCpObsable?.isActive() && (
            <path
              d={`M${pos[0]},${pos[1]} L${prevCpPosX},${prevCpPosY}`}
              stroke="blue"
            />
          )}
          {nextCpObsable?.isActive() && (
            <path
              d={`M${pos[0]},${pos[1]} L${nextCpPosX},${nextCpPosY}`}
              stroke="blue"
            />
          )}
          {prevCpObsable?.isActive() && (
            <Thumb
              val={prevCpObsable.getAbsCoord()}
              onMoving={(newVal) => {
                prevCp?.setAbsCoord(newVal);
              }}
              {...(prevPtObsable && {
                constraintX: [
                  prevPtObsable.coord[0],
                  ptObsable.coord[0],
                ] as Range,
                constraintY: [
                  prevPtObsable.coord[1],
                  ptObsable.coord[1],
                ] as Range,
              })}
            />
          )}
          {nextCpObsable?.isActive() && (
            <Thumb
              val={nextCpObsable.getAbsCoord()}
              onMoving={(newVal) => {
                nextCp?.setAbsCoord(newVal);
              }}
              {...(nextPtObsable && {
                constraintX: [
                  nextPtObsable.coord[0],
                  ptObsable.coord[0],
                ] as Range,
                constraintY: [
                  nextPtObsable.coord[1],
                  ptObsable.coord[1],
                ] as Range,
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
        constraintX={ptObsable.getRangeX()}
      />
      <text x={pos[0] + 10} y={pos[1] - 10} fontSize={12} fill="black">
        {JSON.stringify(ptObsable.getRangeX())}
      </text>
    </>
  );
};

export default Node;
