import { useMove } from '@react-aria/interactions';
import { useRef, useCallback, useState, use } from 'react';
import { clamp } from '../../utils/math';

type Vec2 = [number, number];

type ThumbProps = {
  val: Vec2;
  range: [Vec2, Vec2];
  parentSize: Vec2;
  size?: number;
  order?: 'first' | 'middle' | 'last';
  constraint?: [Vec2, Vec2];
  tabIndex: number;
  onChange?: (val: Vec2) => void;
};

export const Thumb = ({
  val,
  range,
  parentSize,
  size = 40,
  order = 'middle',
  constraint,
  tabIndex,
  onChange,
}: ThumbProps) => {
  const [parentW, parentH] = parentSize;
  const [[minValX, minValY], [maxValX, maxValY]] = range;
  const padding = 0.5 * size;
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

  const isDragging = useRef(false);
  const [internalPos, setInternalPos] = useState<Vec2>(valToPos(val));
  const displayPos = isDragging.current ? clampPos(internalPos) : valToPos(val);

  const { moveProps } = useMove({
    onMoveStart() {
      isDragging.current = true;
      setInternalPos(valToPos(val)); // 드래그 시작 시 외부값 기준으로 초기화
    },
    onMove(e) {
      setInternalPos((prev) => {
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
      isDragging.current = false;
      setInternalPos(valToPos(val)); // 드래그 끝나면 외부값에 동기화
    },
  });

  return (
    <circle
      {...moveProps}
      tabIndex={tabIndex}
      cx={displayPos[0]}
      cy={displayPos[1]}
      r={size / 2}
      fill="#fff"
      stroke="#ccc"
      strokeWidth={2}
    />
  );
};
