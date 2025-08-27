import React, { useCallback, useMemo, useRef } from 'react';
import type { Vec2 } from '@/types';
import {
  type AnyFnPtInstance,
  type AnyFnPtObsProps,
  type ControlPtObsProps,
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

  const handleThumbSelect = useCallback(() => {
    console.log(`select point idx:${idx}`);
  }, [idx]);

  const controlPt = useMemo(() => {
    if (!prevCpProps?.isActive() && !nextCpProps?.isActive()) return;
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
              ] as Vec2,
              rangeY: [
                prevPtProps.getCoord()[1],
                ptProps.getCoord()[1],
              ] as Vec2,
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
              ] as Vec2,
              rangeY: [
                nextPtProps.getCoord()[1],
                ptProps.getCoord()[1],
              ] as Vec2,
            })}
          />
        )}
      </>
    );
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

  const handleThumbMoving = useCallback(
    (newCoord: Vec2) => {
      point.coord = newCoord;
    },
    [point]
  );

  return (
    <>
      {controlPt}
      <Thumb
        coord={ptProps.getCoord()}
        tabIndex={idx}
        rangeX={ptProps.getRangeX()}
        onMoving={handleThumbMoving}
        onSelect={handleThumbSelect}
      />
      <text
        x={pos[0]}
        y={pos[1] - 20}
        fontSize={12}
        fill="black"
        textAnchor="middle"
        style={{ userSelect: 'none' }}
      >
        {renderCntRef.current}
      </text>
      <text
        x={pos[0]}
        y={pos[1] - 8}
        fontSize={12}
        fill="black"
        textAnchor="middle"
        style={{ userSelect: 'none' }}
      >
        {`${point.coord[0].toFixed(2)}, ${point.coord[1].toFixed(2)}`}
      </text>
    </>
  );
};

export default React.memo(Node);
