import type { Vec2, Mat2, Order } from './Grapher.types';
import { useCallback, useRef, useState } from 'react';
import { clamp } from '../../utils/math';
import { useMove } from '@react-aria/interactions';

type ThumbProps = {
  val: Vec2;
  range2d: Mat2;
  parentSize: Vec2;
  size?: number;
  order?: Order;
  constraint?: Mat2;
  tabIndex: number;
  onChange?: (val: Vec2) => void;
};

const VISUAL_SIZE = 8;

const Thumb = ({
  val,
  range2d,
  parentSize,
  size,
  order,
  constraint,
  tabIndex,
  onChange,
}: ThumbProps) => {
  const [[minValX, minValY], [maxValX, maxValY]] = range2d;
  const [parentW, parentH] = parentSize;
  const usedSize = size || 40;
  const usedOder = order || 'middle';
  const padding = 0.5 * usedSize;
  const minPosX = padding;
  const minPosY = padding;
  const maxPosX = parentW - padding;
  const maxPosY = parentH - padding;

  const valToPos = useCallback(
    (val: Vec2): Vec2 => {
      return [
        minPosX +
          ((val[0] - minValX) / (maxValX - minValX)) * (maxPosX - minPosX),
        minPosY +
          (1 - (val[1] - minValY) / (maxValY - minValY)) * (maxPosY - minPosY),
      ];
    },
    [minPosX, minValX, maxValX, maxPosX, minPosY, minValY, maxValY, maxPosY]
  );

  const [constraintMinPosX, constraintMaxPosY] = constraint
    ? valToPos(constraint[0])
    : [minPosX, maxPosY];
  const [constraintMaxPosX, constraintMinPosY] = constraint
    ? valToPos(constraint[1])
    : [maxPosX, minPosY];

  const clampPos = useCallback(
    (pos: Vec2): Vec2 => {
      const clampedPos = clamp(pos, [minPosX, minPosY], [maxPosX, maxPosY]);
      const constraintedPos = clamp(
        clampedPos,
        [constraintMinPosX, constraintMinPosY],
        [constraintMaxPosX, constraintMaxPosY]
      );
      return constraintedPos as Vec2;
    },
    [
      minPosX,
      minPosY,
      maxPosX,
      maxPosY,
      constraintMinPosX,
      constraintMinPosY,
      constraintMaxPosX,
      constraintMaxPosY,
    ]
  );

  const posToVal = useCallback(
    (pos: Vec2): Vec2 => {
      return [
        minValX +
          ((pos[0] - minPosX) / (maxPosX - minPosX)) * (maxValX - minValX),
        minValY +
          (1 - (pos[1] - minPosY) / (maxPosY - minPosY)) * (maxValY - minValY),
      ];
    },
    [minValX, minValY, maxValX, maxValY, minPosX, maxPosX, minPosY, maxPosY]
  );

  const isDraggingRef = useRef(false);
  const [internalPosState, setInternalPosState] = useState<Vec2>(valToPos(val));
  const displayPos = isDraggingRef.current
    ? clampPos(internalPosState)
    : valToPos(val);

  const { moveProps } = useMove({
    onMoveStart() {
      isDraggingRef.current = true;
      setInternalPosState(valToPos(val));
    },
    onMove(e) {
      setInternalPosState((prev) => {
        let newPos = [...prev] as Vec2;
        if (e.pointerType === 'keyboard') newPos = clampPos(newPos);
        newPos[0] += e.deltaX;
        newPos[1] += e.deltaY;
        const clamped = clampPos(newPos);
        onChange?.(posToVal(clamped));
        return newPos;
      });
    },
    onMoveEnd() {
      isDraggingRef.current = false;
      setInternalPosState(valToPos(val));
    },
  });

  return (
    <g>
      <rect
        x={displayPos[0] - 0.5 * VISUAL_SIZE}
        y={displayPos[1] - 0.5 * VISUAL_SIZE}
        width={VISUAL_SIZE}
        height={VISUAL_SIZE}
        fill="#fff"
        stroke="transparent"
        strokeWidth={0}
      />
      <circle
        {...moveProps}
        tabIndex={tabIndex}
        cx={displayPos[0]}
        cy={displayPos[1]}
        r={usedSize / 2}
        fill="oklch(0.9 0.1 0 / .5)"
        stroke="transparent"
        strokeWidth={0}
      />
    </g>
  );
};
export default Thumb;
