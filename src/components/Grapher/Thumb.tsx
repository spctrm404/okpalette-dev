import type { Vec2, Mat2, Order } from './Grapher.types';
import { useCallback, useRef, useState } from 'react';
import { clamp } from '../../utils/math';
import { mergeProps, useHover, useMove, usePress } from 'react-aria';

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

  const isMovingRef = useRef(false);
  const [internalPosState, setInternalPosState] = useState<Vec2>(valToPos(val));
  const usedPos = isMovingRef.current
    ? clampPos(internalPosState)
    : valToPos(val);

  const { hoverProps, isHovered } = useHover({
    onHoverStart: () => {
      // console.log('hover start');`
    },
    onHoverEnd: () => {
      // console.log('hover end');`
    },
  });

  const { pressProps, isPressed } = usePress({
    onPressStart: () => {
      // console.log('press start');`
    },
    onPressEnd: () => {
      // console.log('press end');`
    },
    onPress: () => {},
  });

  const { moveProps } = useMove({
    onMoveStart() {
      isMovingRef.current = true;
    },
    onMove(e) {
      setInternalPosState((prev) => {
        const newPos = e.pointerType === 'keyboard' ? clampPos(prev) : prev;
        newPos[0] += e.deltaX;
        newPos[1] += e.deltaY;
        if (onChange) {
          const clampedPos = clampPos(newPos);
          const val = posToVal(clampedPos);
          queueMicrotask(() => onChange(val));
        }
        return newPos;
      });
    },
    onMoveEnd() {
      isMovingRef.current = false;
      setInternalPosState(valToPos(val));
    },
  });

  const racProps = mergeProps(hoverProps, pressProps, moveProps);

  const visualRef = useRef<SVGCircleElement>(null);

  return (
    <g>
      <circle
        ref={visualRef}
        cx={usedPos[0]}
        cy={usedPos[1]}
        r={0.5 * VISUAL_SIZE}
        fill="#fff"
        stroke="transparent"
        strokeWidth="0"
      />
      <circle
        {...racProps}
        tabIndex={tabIndex}
        cx={usedPos[0]}
        cy={usedPos[1]}
        r={usedSize / 2}
        fill="transparent"
        stroke="none"
      />
    </g>
  );
};
export default Thumb;
