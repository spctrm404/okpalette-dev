import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { mergeProps, useHover, useMove, usePress } from 'react-aria';
import type { Vec2 } from '@/types';
import { useGraphContext } from './Graph.context';
import classes from './_Thumb.module.scss';
import clsx from 'clsx';
import { clamp } from '@/utils';

type ThumbProps = {
  coord: Vec2;
  rangeX?: Vec2;
  rangeY?: Vec2;
  tabIndex?: number;
  onMoving?: (coord: Vec2) => void;
  onSelect?: () => void;
};

const Thumb = ({
  coord,
  rangeX,
  rangeY,
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
  } = useGraphContext();

  const isMoving = useRef(false);
  const [internalPos, setInternalPos] = useState<Vec2>(coordToPos(coord));
  useLayoutEffect(() => {
    if (isMoving.current) return;
    setInternalPos(coordToPos(coord));
  }, [coord, coordToPos]);

  const constrainPos = useCallback(
    (pos: Vec2): Vec2 => {
      let [posX, posY] = clampPos(pos);
      if (!rangeX && !rangeY) return [posX, posY];
      if (rangeX) {
        const [minCoordX, maxCoordX] = rangeX;
        const [minPosX] = coordToPos([minCoordX, 0]);
        const [maxPosX] = coordToPos([maxCoordX, 0]);
        posX = clamp(posX, minPosX, maxPosX);
      }
      if (rangeY) {
        const [minCoordY, maxCoordY] = rangeY;
        const [, minPosY] = coordToPos([0, minCoordY]);
        const [, maxPosY] = coordToPos([0, maxCoordY]);
        posY = clamp(posY, minPosY, maxPosY);
      }
      return [posX, posY];
    },
    [rangeX, rangeY, coordToPos, clampPos]
  );

  const { hoverProps, isHovered } = useHover({
    onHoverStart: () => {},
    onHoverEnd: () => {},
  });
  const { pressProps, isPressed } = usePress({
    onPressStart: () => {},
    onPressEnd: () => {},
    onPress: () => {
      onSelect?.();
    },
  });
  const { moveProps } = useMove({
    onMoveStart() {
      isMoving.current = true;
      onSelect?.();
    },
    onMove(e) {
      const newPos =
        e.pointerType === 'keyboard' ? constrainPos(internalPos) : internalPos;
      newPos[0] += e.deltaX;
      newPos[1] += e.deltaY;
      setInternalPos(newPos);
      const constrainedPos = constrainPos(newPos);
      const newCoord = posToCoord(constrainedPos);
      onMoving?.(newCoord);
    },
    onMoveEnd() {
      isMoving.current = false;
      const newPos = constrainPos(internalPos);
      setInternalPos(newPos);
      const newCoord = posToCoord(newPos);
      onMoving?.(newCoord);
    },
  });

  const racProps = mergeProps(hoverProps, pressProps, moveProps);

  const [usedPosX, usedPosY] = onMoving
    ? isMoving.current
      ? constrainPos(internalPos)
      : coordToPos(coord)
    : constrainPos(internalPos);
  const usedIsHovered = isHovered || isMoving.current;
  const usedIsPressed = isPressed || isMoving.current;

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
export default React.memo(Thumb);
