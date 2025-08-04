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
  vals: Vec2;
  valsBound: Mat2;
  parentSize: Vec2;
  interactionSize?: number;
  displaySize?: number;
  order?: Order;
  valsConstraint?: Mat2;
  tabIndex: number;
  onChange?: (val: Vec2) => void;
};

const Thumb = ({
  vals,
  valsBound,
  parentSize,
  interactionSize,
  displaySize,
  order,
  valsConstraint,
  tabIndex,
  onChange,
}: ThumbProps) => {
  const [minVals, maxVals] = valsBound;
  const [parentW, parentH] = parentSize;
  const usedInteractionSize = interactionSize || THUMB_INTERACTION_SIZE;
  const padding = 0.5 * usedInteractionSize;
  const minPosX = padding;
  const minPosY = padding;
  const maxPosX = parentW - padding;
  const maxPosY = parentH - padding;
  const valsToPos = useCallback(
    (vals: Vec2): Vec2 => {
      return map(
        vals,
        minVals,
        maxVals,
        [minPosX, maxPosY],
        [maxPosX, minPosY]
      ) as Vec2;
    },
    [minPosX, minPosY, maxPosX, maxPosY, maxVals, minVals]
  );
  const posToVals = useCallback(
    (pos: Vec2): Vec2 =>
      map(
        pos,
        [minPosX, maxPosY],
        [maxPosX, minPosY],
        minVals,
        maxVals
      ) as Vec2,
    [minPosX, minPosY, maxPosX, maxPosY, maxVals, minVals]
  );

  const [constraintMinPosX, constraintMaxPosY] = valsConstraint
    ? valsToPos(valsConstraint[0])
    : [minPosX, maxPosY];
  const [constraintMaxPosX, constraintMinPosY] = valsConstraint
    ? valsToPos(valsConstraint[1])
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
  const [internalPosState, setInternalPosState] = useState<Vec2>(
    valsToPos(vals)
  );
  useLayoutEffect(() => {
    if (isMovingRef.current) return;

    setInternalPosState(valsToPos(vals));
  }, [vals, valsToPos]);

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
      const newVal = posToVals(clampedPos);
      onChange?.(newVal);
    },
    onMoveEnd() {
      isMovingRef.current = false;
      const newPos = clampPos(internalPosState);
      const newVal = posToVals(newPos);
      setInternalPosState(valsToPos(newVal));
      onChange?.(newVal);
    },
  });

  const racProps = mergeProps(hoverProps, pressProps, moveProps);

  const usedDisplaySize = displaySize || THUMB_DISPLAY_SIZE;
  const usedOrder = order || 'middle';
  const usedPos = isMovingRef.current
    ? clampPos(internalPosState)
    : valsToPos(vals);

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
      data-order={usedOrder}
      data-display-size={usedDisplaySize}
      data-interaction-size={usedInteractionSize}
    >
      <circle
        className={clsx(classes.display)}
        cx={usedPos[0]}
        cy={usedPos[1]}
        r={0.5 * usedDisplaySize}
        fill="#fff"
        stroke="transparent"
        strokeWidth="0"
      />
      <circle
        className={clsx(classes.interaction)}
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
