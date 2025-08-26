import { useMemo, useRef } from 'react';
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
  const renderCntRef = useRef(0);
  renderCntRef.current++;

  const { coordToPos } = useGraph();

  const prevCp = point instanceof BezierPoint ? point.prevCp : undefined;
  const nextCp = point instanceof BezierPoint ? point.nextCp : undefined;

  const ptProps = usePoint(point)! as AnyFnPtObsProps;
  const prevPtProps = usePoint(point.prevPt);
  const nextPtProps = usePoint(point.nextPt);
  const prevCpProps = usePoint(prevCp) as ControlPtObsProps | undefined;
  const nextCpProps = usePoint(nextCp) as ControlPtObsProps | undefined;

  const pos = coordToPos(ptProps.getCoord());

  const controlPt = useMemo(() => {
    if (prevCpProps?.isActive() || nextCpProps?.isActive()) {
      const [prevCpPosX, prevCpPosY] = prevCpProps?.isActive()
        ? coordToPos(prevCpProps.getAbsCoord())
        : pos;
      const [nextCpPosX, nextCpPosY] = nextCpProps?.isActive()
        ? coordToPos(nextCpProps.getAbsCoord())
        : pos;
      return (
        <>
          {prevCpProps?.isActive() && (
            <path
              d={`M${pos[0]},${pos[1]} L${prevCpPosX},${prevCpPosY}`}
              stroke="blue"
              strokeDasharray="4 2"
            />
          )}
          {nextCpProps?.isActive() && (
            <path
              d={`M${pos[0]},${pos[1]} L${nextCpPosX},${nextCpPosY}`}
              stroke="blue"
              strokeDasharray="4 2"
            />
          )}
          {prevCpProps?.isActive() && (
            <Thumb
              coord={prevCpProps.getAbsCoord()}
              onMoving={(newVal) => {
                if (prevCp) prevCp.absCoord = newVal;
              }}
              {...(prevPtProps && {
                rangeX: [
                  prevPtProps.getCoord()[0],
                  ptProps.getCoord()[0],
                ] as Range,
                rangeY: [
                  prevPtProps.getCoord()[1],
                  ptProps.getCoord()[1],
                ] as Range,
              })}
            />
          )}
          {nextCpProps?.isActive() && (
            <Thumb
              coord={nextCpProps.getAbsCoord()}
              onMoving={(newVal) => {
                if (nextCp) nextCp.absCoord = newVal;
              }}
              {...(nextPtProps && {
                rangeX: [
                  nextPtProps.getCoord()[0],
                  ptProps.getCoord()[0],
                ] as Range,
                rangeY: [
                  nextPtProps.getCoord()[1],
                  ptProps.getCoord()[1],
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
    nextCp,
    prevCp,
    ptProps,
    prevPtProps,
    nextPtProps,
    prevCpProps,
    nextCpProps,
    pos,
  ]);

  return (
    <>
      {controlPt}
      <Thumb
        coord={ptProps.getCoord()}
        tabIndex={idx}
        onMoving={(newVal) => {
          point.coord = newVal;
        }}
        rangeX={ptProps.getRangeX()}
      />
      <text
        x={pos[0]}
        y={pos[1] - 8}
        fontSize={12}
        fill="black"
        textAnchor="middle"
        style={{ userSelect: 'none' }}
      >
        {renderCntRef.current}
      </text>
    </>
  );
};

export default Node;
