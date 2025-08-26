import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { mergeProps, useHover, useMove, usePress } from 'react-aria';
import type { Vec2 } from '@/types';
import type { Coord, Range } from '@/models/FnPaths';
import { useGraph } from './Graph.context';
import classes from './_Thumb.module.scss';
import clsx from 'clsx';
import { clamp } from '@/utils';

type ThumbProps = {
  coord: Coord;
  rangeX?: Range;
  rangeY?: Range;
  isSelected?: boolean;
  tabIndex?: number;
  onMoving?: (coord: Coord) => void;
  onSelect?: () => void;
};

const Thumb = ({
  coord: coord,
  rangeX,
  rangeY,
  isSelected,
  tabIndex,
  onMoving,
  onSelect,
}: ThumbProps) => {
  const {
    coordToPos,
    posToCoord,
    clampPos,
    thumbInteractionSize,
    thumbDisplaySize,
  } = useGraph();

  const constrainPos = useCallback(
    (pos: Vec2): Vec2 => {
      let [posX, posY] = clampPos(pos);
      if (!rangeX && !rangeY) return [posX, posY];
      if (rangeX) {
        const [minX, maxX] = rangeX;
        const [minPosX] = coordToPos([minX, 0]);
        const [maxPosX] = coordToPos([maxX, 0]);
        posX = clamp(posX, minPosX, maxPosX);
      }
      if (rangeY) {
        const [minY, maxY] = rangeY;
        const [, minPosY] = coordToPos([0, minY]);
        const [, maxPosY] = coordToPos([0, maxY]);
        posY = clamp(posY, minPosY, maxPosY);
      }
      return [posX, posY];
    },
    [rangeX, rangeY, coordToPos, clampPos]
  );

  const isMovingRef = useRef(false);
  const [internalPosState, setInternalPosState] = useState<Vec2>(
    coordToPos(coord)
  );

  useLayoutEffect(() => {
    if (isMovingRef.current) return;
    setInternalPosState(coordToPos(coord));
  }, [coord, coordToPos]);

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
      const newCoord = posToCoord(constrainedPos);
      onMoving?.(newCoord);
    },
    onMoveEnd() {
      isMovingRef.current = false;
      const newPos = constrainPos(internalPosState);
      setInternalPosState(newPos);
      const newCoord = posToCoord(newPos);
      onMoving?.(newCoord);
    },
  });

  const racProps = mergeProps(hoverProps, pressProps, moveProps);

  const [usedPosX, usedPosY] = onMoving
    ? isMovingRef.current
      ? constrainPos(internalPosState)
      : coordToPos(coord)
    : constrainPos(internalPosState);
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
      data-display-size={thumbDisplaySize}
      data-interaction-size={thumbInteractionSize}
    >
      <circle
        className={clsx(classes.display)}
        cx={usedPosX}
        cy={usedPosY}
        r={0.5 * thumbDisplaySize}
        fill="#fff"
        stroke="none"
        strokeWidth={0}
      />
      <circle
        className={clsx(classes.interaction)}
        {...racProps}
        // tabIndex={tabIndex}
        cx={usedPosX}
        cy={usedPosY}
        r={0.5 * thumbInteractionSize}
        fill="transparent"
        stroke="none"
        cursor="pointer"
      />
    </g>
  );
};
export default Thumb;
