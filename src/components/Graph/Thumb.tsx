import type { Vec2, Mat2 } from '@/types';
import { THUMB_DISPLAY_SIZE, THUMB_INTERACTION_SIZE } from './Graph.constants';
import { clamp, map } from '@/utils';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { mergeProps, useHover, useMove, usePress } from 'react-aria';
import classes from './_Thumb.module.scss';
import clsx from 'clsx';
import { useGraph } from './Graph.context';

type ThumbProps = {
  val: Vec2;
  bound: Mat2;
  parentSize: Vec2;
  constraint?: Mat2;
  interactionSize?: number;
  displaySize?: number;
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
  tabIndex,
  onMoving,
  isSelected,
  onSelect,
}: ThumbProps) => {
  const { coordToPos, posToCoord, clampPos } = useGraph();

  const usedInteractionSize = interactionSize || THUMB_INTERACTION_SIZE;

  const constrainPos = useCallback(
    (pos: Vec2): Vec2 => {
      if (!constraint) return clampPos(pos);
      const constraintMin = coordToPos(constraint[0]);
      const constraintMax = coordToPos(constraint[1]);
      return clamp(pos, constraintMin, constraintMax) as Vec2;
    },
    [constraint, coordToPos, clampPos]
  );

  const isMovingRef = useRef(false);
  const [internalPosState, setInternalPosState] = useState<Vec2>(
    coordToPos(val)
  );

  useLayoutEffect(() => {
    if (isMovingRef.current) return;
    setInternalPosState(coordToPos(val));
  }, [val, coordToPos]);

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
          ? constrainPos(internalPosState)
          : internalPosState;
      newPos[0] += e.deltaX;
      newPos[1] += e.deltaY;
      setInternalPosState(newPos);
      const clampedPos = constrainPos(newPos);
      const newVal = posToCoord(clampedPos);
      onMoving?.(newVal);
    },
    onMoveEnd() {
      isMovingRef.current = false;
      const newPos = constrainPos(internalPosState);
      setInternalPosState(newPos);
      const newVal = posToCoord(newPos);
      onMoving?.(newVal);
    },
  });

  const racProps = mergeProps(hoverProps, pressProps, moveProps);

  const usedDisplaySize = displaySize || THUMB_DISPLAY_SIZE;
  const [usedPosX, usedPosY] = isMovingRef.current
    ? constrainPos(internalPosState)
    : coordToPos(val);
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
