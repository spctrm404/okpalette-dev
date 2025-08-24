import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { mergeProps, useHover, useMove, usePress } from 'react-aria';
import type { Coord, Range } from '@/models/FnPaths';
import { THUMB_DISPLAY_SIZE, THUMB_INTERACTION_SIZE } from './Graph.constants';
import { useGraph } from './Graph.context';
import classes from './_Thumb.module.scss';
import clsx from 'clsx';
import { clamp } from '@/utils';

type ThumbProps = {
  val: Coord;
  constraintX?: Range;
  constraintY?: Range;
  interactionSize?: number;
  displaySize?: number;
  isSelected?: boolean;
  tabIndex?: number;
  onMoving?: (val: Coord) => void;
  onSelect?: () => void;
};

const Thumb = ({
  val,
  constraintX,
  constraintY,
  interactionSize,
  displaySize,
  isSelected,
  tabIndex,
  onMoving,
  onSelect,
}: ThumbProps) => {
  const { coordToPos, posToCoord, clampPos } = useGraph();

  const constrainPos = useCallback(
    (pos: Coord): Coord => {
      let [posX, posY] = clampPos(pos);
      if (!constraintX && !constraintY) return [posX, posY];
      if (constraintX) {
        const [minX, maxX] = constraintX;
        const [minPosX] = coordToPos([minX, 0]);
        const [maxPosX] = coordToPos([maxX, 0]);
        posX = clamp(posX, minPosX, maxPosX);
      }
      if (constraintY) {
        const [minY, maxY] = constraintY;
        const [, minPosY] = coordToPos([0, minY]);
        const [, maxPosY] = coordToPos([0, maxY]);
        posY = clamp(posY, minPosY, maxPosY);
      }
      return [posX, posY];
    },
    [constraintX, constraintY, coordToPos, clampPos]
  );

  const isMovingRef = useRef(false);
  const [internalPosState, setInternalPosState] = useState<Coord>(
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
      const constrainedPos = constrainPos(newPos);
      const newVal = posToCoord(constrainedPos);
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

  const [usedPosX, usedPosY] = onMoving
    ? isMovingRef.current
      ? constrainPos(internalPosState)
      : coordToPos(val)
    : constrainPos(internalPosState);
  const usedInteractionSize = interactionSize || THUMB_INTERACTION_SIZE;
  const usedDisplaySize = displaySize || THUMB_DISPLAY_SIZE;
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
