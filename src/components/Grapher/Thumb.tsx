import type { Vec2, Mat2, Order } from './Grapher.types';
import {
  THUMB_DISPLAY_SIZE,
  THUMB_INTERACTION_SIZE,
} from './Grapher.constants';
import { clamp, map } from '../../utils/math';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { mergeProps, useHover, useMove, usePress } from 'react-aria';
import classes from './_Thumb.module.scss';
import clsx from 'clsx';

type ThumbProps = {
  val: Vec2;
  bound: Mat2;
  parentSize: Vec2;
  constraint?: Mat2;
  interactionSize?: number;
  displaySize?: number;
  order?: Order;
  tabIndex?: number;
  onMoving?: (val: Vec2) => void;
  isSelected?: boolean;
  onSelect?: () => void;
};

const Thumb = ({
  val,
  bound,
  parentSize,
  constraint,
  interactionSize,
  displaySize,
  order,
  tabIndex,
  onMoving,
  isSelected,
  onSelect,
}: ThumbProps) => {
  const [minVal, maxVal] = bound;
  const [parentW, parentH] = parentSize;
  const usedInteractionSize = interactionSize || THUMB_INTERACTION_SIZE;
  const padding = 0.5 * usedInteractionSize;
  const minPosX = padding;
  const minPosY = padding;
  const maxPosX = parentW - padding;
  const maxPosY = parentH - padding;

  const valToPos = useCallback(
    (val: Vec2): Vec2 => {
      return map(
        val,
        minVal,
        maxVal,
        [minPosX, maxPosY],
        [maxPosX, minPosY]
      ) as Vec2;
    },
    [maxVal, minVal, minPosX, minPosY, maxPosX, maxPosY]
  );

  const posToVal = useCallback(
    (pos: Vec2): Vec2 =>
      map(pos, [minPosX, maxPosY], [maxPosX, minPosY], minVal, maxVal) as Vec2,
    [maxVal, minVal, minPosX, minPosY, maxPosX, maxPosY]
  );

  const clampPos = useCallback(
    (pos: Vec2): Vec2 => {
      const constraintMin = constraint
        ? valToPos(constraint[0])
        : [minPosX, minPosY];
      const constraintMax = constraint
        ? valToPos(constraint[1])
        : [maxPosX, maxPosY];
      const clampedPos = clamp(pos, [minPosX, minPosY], [maxPosX, maxPosY]);
      const constraintedPos = clamp(clampedPos, constraintMin, constraintMax);
      return constraintedPos as Vec2;
    },
    [constraint, minPosX, minPosY, maxPosX, maxPosY, valToPos]
  );

  const isMovingRef = useRef(false);
  const [internalPosState, setInternalPosState] = useState<Vec2>(valToPos(val));

  useLayoutEffect(() => {
    if (isMovingRef.current) return;
    setInternalPosState(valToPos(val));
  }, [val, valToPos]);

  const { hoverProps, isHovered } = useHover({
    onHoverStart: () => {},
    onHoverEnd: () => {},
  });
  const { pressProps, isPressed } = usePress({
    onPressStart: () => {},
    onPressEnd: () => {},
    onPress: () => {
      if (!isSelected) onSelect?.();
    },
  });
  const { moveProps } = useMove({
    onMoveStart() {
      isMovingRef.current = true;
      if (!isSelected) onSelect?.();
    },
    onMove(e) {
      const newPos =
        e.pointerType === 'keyboard'
          ? clampPos(internalPosState)
          : internalPosState;
      newPos[0] += e.deltaX;
      newPos[1] += e.deltaY;
      setInternalPosState(newPos);
      const clampedPos = clampPos(newPos);
      const newVal = posToVal(clampedPos);
      onMoving?.(newVal);
    },
    onMoveEnd() {
      isMovingRef.current = false;
      const newPos = clampPos(internalPosState);
      setInternalPosState(newPos);
      const newVal = posToVal(newPos);
      onMoving?.(newVal);
    },
  });

  const racProps = mergeProps(hoverProps, pressProps, moveProps);

  const usedDisplaySize = displaySize || THUMB_DISPLAY_SIZE;
  const usedOrder = order || 'middle';
  const [usedPosX, usedPosY] = isMovingRef.current
    ? clampPos(internalPosState)
    : valToPos(val);
  const usedIsHovered = isHovered || isMovingRef.current;
  const usedIsPressed = isPressed || isMovingRef.current;

  useLayoutEffect(() => {
    if (usedIsPressed) document.body.style.cursor = 'pointer';
    else document.body.style.cursor = '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [usedIsPressed]);

  return (
    <g
      className={clsx(classes.container)}
      data-hovered={usedIsHovered}
      data-pressed={usedIsPressed}
      data-selected={isSelected}
      data-order={usedOrder}
      data-display-size={usedDisplaySize}
      data-interaction-size={usedInteractionSize}
    >
      <circle
        className={clsx(classes.display)}
        cx={usedPosX}
        cy={usedPosY}
        r={0.5 * usedDisplaySize}
        fill="#fff"
        stroke="transparent"
        strokeWidth="0"
      />
      <circle
        className={clsx(classes.interaction)}
        {...racProps}
        // tabIndex={tabIndex}
        cx={usedPosX}
        cy={usedPosY}
        r={0.5 * usedInteractionSize}
        fill="transparent"
        stroke="none"
        cursor="pointer"
      />
    </g>
  );
};
export default Thumb;
