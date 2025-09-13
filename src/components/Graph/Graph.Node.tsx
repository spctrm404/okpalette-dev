import React, { useCallback, useMemo, useRef } from 'react';
import type { Vec2 } from '@/types';
import {
  type AnyFnPtInstance,
  type AnyFnPtObsProps,
  type ControlPtObsProps,
  BezierPoint,
} from '@/models/FnPaths';
import { usePoint } from '@/hooks/FnPaths';
import { useGraphContext } from './Graph.context';
import Thumb from './Graph.Thumb';

type PointProps = {
  point: AnyFnPtInstance;
  idx: number;
  onSelectThumb?: (index: number) => void;
};

const Node = ({ point, idx, onSelectThumb }: PointProps) => {
  const renderCntRef = useRef(0);
  renderCntRef.current++;

  const { coordToPos } = useGraphContext();

  const prevPt = point instanceof BezierPoint ? point.prevPt : undefined;
  const nextPt = point instanceof BezierPoint ? point.nextPt : undefined;
  const prevCp = point instanceof BezierPoint ? point.prevCp : undefined;
  const nextCp = point instanceof BezierPoint ? point.nextCp : undefined;
  const ptProps = usePoint(point)! as AnyFnPtObsProps;
  const prevPtProps = usePoint(prevPt);
  const nextPtProps = usePoint(nextPt);
  const prevCpProps = usePoint(prevCp) as ControlPtObsProps | undefined;
  const nextCpProps = usePoint(nextCp) as ControlPtObsProps | undefined;

  const handlePrevCpMoving = useCallback(
    (newCoord: Vec2) => {
      if (prevCp) prevCp.absCoord = newCoord;
    },
    [prevCp]
  );
  const handleNextCpMoving = useCallback(
    (newCoord: Vec2) => {
      if (nextCp) nextCp.absCoord = newCoord;
    },
    [nextCp]
  );
  const elemControlPt = useMemo(() => {
    if (!prevCpProps?.isActive() && !nextCpProps?.isActive()) return;
    const pos = coordToPos(ptProps.getCoord());
    const prevCpPos = prevCpProps?.isActive()
      ? coordToPos(prevCpProps.getAbsCoord())
      : pos;
    const nextCpPos = nextCpProps?.isActive()
      ? coordToPos(nextCpProps.getAbsCoord())
      : pos;
    return (
      <>
        {prevCpProps?.isActive() && (
          <>
            <path
              d={`M${pos[0]},${pos[1]} L${prevCpPos[0]},${prevCpPos[1]}`}
              stroke="blue"
              strokeDasharray="4 2"
            />
            <Thumb
              coord={prevCpProps.getAbsCoord()}
              onMoving={handlePrevCpMoving}
              rangeX={prevCpProps.getRangeX()}
              rangeY={prevCpProps.getRangeY()}
            />
          </>
        )}
        {nextCpProps?.isActive() && (
          <>
            <path
              d={`M${pos[0]},${pos[1]} L${nextCpPos[0]},${nextCpPos[1]}`}
              stroke="blue"
              strokeDasharray="4 2"
            />
            <Thumb
              coord={nextCpProps.getAbsCoord()}
              onMoving={handleNextCpMoving}
              rangeX={nextCpProps.getRangeX()}
              rangeY={nextCpProps.getRangeY()}
            />
          </>
        )}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    coordToPos,
    ptProps,
    prevPtProps,
    nextPtProps,
    prevCpProps,
    nextCpProps,
    handlePrevCpMoving,
    handleNextCpMoving,
  ]);

  const handleThumbMoving = useCallback(
    (newCoord: Vec2) => {
      point.coord = newCoord;
    },
    [point]
  );

  return (
    <>
      {elemControlPt}
      <Thumb
        coord={ptProps.getCoord()}
        tabIndex={idx}
        rangeX={ptProps.getRangeX()}
        onMoving={handleThumbMoving}
        onSelect={() => onSelectThumb?.(idx)}
      />
      <text
        x={coordToPos(ptProps.getCoord())[0]}
        y={coordToPos(ptProps.getCoord())[1] - 20}
        fontSize={12}
        fill="black"
        textAnchor="middle"
        style={{ userSelect: 'none' }}
      >
        {renderCntRef.current}
      </text>
      <text
        x={coordToPos(ptProps.getCoord())[0]}
        y={coordToPos(ptProps.getCoord())[1] - 8}
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
