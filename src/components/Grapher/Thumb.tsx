import type { Vec2, Mat2, Order } from './Grapher.types';
import {
  THUMB_DISPLAY_SIZE,
  THUMB_INTERACTION_SIZE,
} from './Grapher.constants';
import { useCallback, useRef, useState } from 'react';
import { clamp } from '../../utils/math';
import { mergeProps, useHover, useMove, usePress } from 'react-aria';

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
}: ThumbProps) => {
  const [[minValX, minValY], [maxValX, maxValY]] = valBound2d;
  const valRangeX = maxValX - minValX;
  const valRangeY = maxValY - minValY;
  const [parentW, parentH] = parentSize;
  const usedInteractionSize = interactionSize || THUMB_INTERACTION_SIZE;
  const padding = 0.5 * usedInteractionSize;
  const minPosX = padding;
  const minPosY = padding;
  const maxPosX = parentW - padding;
  const maxPosY = parentH - padding;
  const posRangeX = maxPosX - minPosX;
  const posRangeY = maxPosY - minPosY;

  const valToPos = useCallback(
    ([valX, valY]: Vec2): Vec2 => {
      return [
        minPosX + ((valX - minValX) / valRangeX) * posRangeX,
        minPosY + (1 - (valY - minValY) / valRangeY) * posRangeY,
      ];
    },
    [
      minPosX,
      minPosY,
      minValX,
      minValY,
      posRangeX,
      posRangeY,
      valRangeX,
      valRangeY,
    ]
  );
  const posToVal = useCallback(
    ([posX, posY]: Vec2): Vec2 => {
      return [
        minValX + ((posX - minPosX) / posRangeX) * valRangeX,
        minValY + (1 - (posY - minPosY) / posRangeY) * valRangeY,
      ];
    },
    [
      minPosX,
      minPosY,
      minValX,
      minValY,
      posRangeX,
      posRangeY,
      valRangeX,
      valRangeY,
    ]
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

  const usedDisplaySize = displaySize || THUMB_DISPLAY_SIZE;
  const usedOrder = order || 'middle';

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
          onChange(val);
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

  const displayElemRef = useRef<SVGCircleElement>(null);

  return (
    <g>
      <circle
        ref={displayElemRef}
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
        r={usedInteractionSize / 2}
        fill="transparent"
        stroke="none"
      />
    </g>
  );
};
export default Thumb;
