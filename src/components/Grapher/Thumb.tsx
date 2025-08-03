import type { Vec2, Mat2, Order } from './Grapher.types';
import {
  THUMB_DISPLAY_SIZE,
  THUMB_INTERACTION_SIZE,
} from './Grapher.constants';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { clamp, map } from '../../utils/math';
import { mergeProps, useFocus, useHover, useMove, usePress } from 'react-aria';

type ThumbProps = {
  val: Vec2;
  valBound2d: Mat2;
  parentSize: Vec2;
  interactionSize?: number;
  displaySize?: number;
  order?: Order;
  valConstraint2d?: Mat2;
  tabIndex: number;
  onChange?: (val: Vec2) => void;
  debug?: boolean;
};

const Thumb = ({
  val,
  valBound2d,
  parentSize,
  interactionSize,
  displaySize,
  order,
  valConstraint2d,
  tabIndex,
  onChange,
  debug,
}: ThumbProps) => {
  const [minVal2d, maxVal2d] = valBound2d;
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
        minVal2d,
        maxVal2d,
        [minPosX, maxPosY],
        [maxPosX, minPosY]
      ) as Vec2;
    },
    [minPosX, minPosY, maxPosX, maxPosY, maxVal2d, minVal2d]
  );
  const posToVal = useCallback(
    (pos: Vec2): Vec2 =>
      map(
        pos,
        [minPosX, maxPosY],
        [maxPosX, minPosY],
        minVal2d,
        maxVal2d
      ) as Vec2,
    [minPosX, minPosY, maxPosX, maxPosY, maxVal2d, minVal2d]
  );

  const [constraintMinPosX, constraintMaxPosY] = valConstraint2d
    ? valToPos(valConstraint2d[0])
    : [minPosX, maxPosY];
  const [constraintMaxPosX, constraintMinPosY] = valConstraint2d
    ? valToPos(valConstraint2d[1])
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

  const isMovingRef = useRef(false);
  const [internalPosState, setInternalPosState] = useState<Vec2>(valToPos(val));
  useLayoutEffect(() => {
    if (isMovingRef.current) return;

    setInternalPosState(valToPos(val));
  }, [val, valToPos]);

  const [isFocusedState, setIsFocusedState] = useState(false);

  const { hoverProps, isHovered } = useHover({
    onHoverStart: () => {},
    onHoverEnd: () => {},
  });
  const { pressProps, isPressed } = usePress({
    onPressStart: () => {},
    onPressEnd: () => {},
    onPress: () => {},
  });
  const { moveProps } = useMove({
    onMoveStart() {
      isMovingRef.current = true;
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
      onChange?.(newVal);
    },
    onMoveEnd() {
      isMovingRef.current = false;
      const newPos = clampPos(internalPosState);
      const newVal = posToVal(newPos);
      setInternalPosState(valToPos(newVal));
      onChange?.(newVal);
    },
  });
  const { focusProps } = useFocus({
    onFocus: () => {
      setIsFocusedState(true);
    },
    onBlur: () => {
      setIsFocusedState(false);
    },
    onFocusChange: () => {},
  });

  const racProps = mergeProps(hoverProps, pressProps, moveProps, focusProps);

  const usedDisplaySize = displaySize || THUMB_DISPLAY_SIZE;
  const usedOrder = order || 'middle';
  const usedPos = isMovingRef.current
    ? clampPos(internalPosState)
    : valToPos(val);

  const usedIsHovered = isHovered || isMovingRef.current;
  const usedIsPressed = isPressed || isMovingRef.current;
  const usedIsFocused = isFocusedState;

  return (
    <g
      data-hovered={usedIsHovered}
      data-pressed={usedIsPressed}
      data-focused={usedIsFocused}
      data-order={usedOrder}
    >
      <circle
        cx={usedPos[0]}
        cy={usedPos[1]}
        r={0.5 * usedDisplaySize}
        fill="#fff"
        stroke="transparent"
        strokeWidth="0"
      />
      <circle
        {...racProps}
        tabIndex={tabIndex}
        cx={usedPos[0]}
        cy={usedPos[1]}
        r={0.5 * usedInteractionSize}
        fill="transparent"
        stroke="none"
        cursor="pointer"
      />
    </g>
  );
};
export default Thumb;
