import type {
  Vec2,
  Mat2,
  Path,
  PointPrevBezier,
  PointNextBezier,
} from './Grapher.types';
import Thumb from './Thumb';
import { THUMB_INTERACTION_SIZE } from './Grapher.constants';
import { map } from '../../utils/math';
import { useCallback } from 'react';

type ControlPointProps = {
  path: Path;
  idx: number;
  bound: Mat2;
  parentSize: Vec2;
  thumbSize?: number;
  onMoving?: (idx: number, relVal: Vec2, fieldName: string) => void;
};

const ControlPoint = ({
  path,
  idx,
  bound,
  parentSize,
  thumbSize,
  onMoving,
}: ControlPointProps) => {
  const point = path[idx];
  const { val } = point;

  const cpRelValToCpAbsVal = useCallback(
    (relVal: Vec2, neighborVal: Vec2) =>
      map(relVal, [0, 0], [1, 1], val, neighborVal) as Vec2,
    [val]
  );

  const cpAbsValToCpRelVal = useCallback(
    (absVal: Vec2, neighborVal: Vec2) =>
      map(absVal, val, neighborVal, [0, 0], [1, 1]) as Vec2,
    [val]
  );

  const prevPoint = idx > 0 ? path[idx - 1] : undefined;
  const nextPoint = idx < path.length - 1 ? path[idx + 1] : undefined;
  const prevVal = prevPoint ? prevPoint.val : val;
  const nextVal = nextPoint ? nextPoint.val : val;

  const getCpAbsVal = useCallback(
    (heading: 'prev' | 'next') => {
      if (heading === 'prev' && prevPoint && 'prevCpRelVal' in point) {
        const { prevCpRelVal: cpRelVal } = point as PointPrevBezier;
        const neighborVal = prevVal;
        const cpAbsVal = cpRelValToCpAbsVal(cpRelVal, neighborVal);
        return cpAbsVal;
      } else if (heading === 'next' && nextPoint && 'nextCpRelVal' in point) {
        const { nextCpRelVal: cpRelVal } = point as PointNextBezier;
        const neighborVal = nextVal;
        const cpAbsVal = cpRelValToCpAbsVal(cpRelVal, neighborVal);
        return cpAbsVal;
      }
      return val;
    },
    [point, val, prevPoint, nextPoint, prevVal, nextVal, cpRelValToCpAbsVal]
  );

  const prevCpAbsVal = getCpAbsVal('prev');
  const nextCpAbsVal = getCpAbsVal('next');
  const hasPrevCp = 'prevCpRelVal' in point;
  const hasNextCp = 'nextCpRelVal' in point;

  const [minVal, maxVal] = bound;
  const [parentW, parentH] = parentSize;
  const usedThumbSize = thumbSize || THUMB_INTERACTION_SIZE;
  const padding = 0.5 * usedThumbSize;
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

  const d = useCallback(
    (cpAbsVal: Vec2) => {
      const [cpX, cpY] = valToPos(cpAbsVal);
      const [x, y] = valToPos(val);
      return `M${x},${y} L${cpX},${cpY}`;
    },
    [val, valToPos]
  );

  return (
    <>
      {hasPrevCp && (
        <>
          <path
            d={d(prevCpAbsVal)}
            fill="none"
            stroke="black"
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Thumb
            val={prevCpAbsVal}
            bound={bound}
            constraint={[val, prevVal]}
            parentSize={parentSize}
            onMoving={(val: Vec2) => {
              const relVal = cpAbsValToCpRelVal(val, prevVal);
              onMoving?.(idx, relVal, 'prevCpRelVal');
            }}
          />
        </>
      )}
      {hasNextCp && (
        <>
          <path
            d={d(nextCpAbsVal)}
            fill="none"
            stroke="black"
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Thumb
            val={nextCpAbsVal}
            bound={bound}
            constraint={[val, nextVal]}
            parentSize={parentSize}
            onMoving={(val: Vec2) => {
              const relVal = cpAbsValToCpRelVal(val, nextVal);
              onMoving?.(idx, relVal, 'nextCpRelVal');
            }}
          />
        </>
      )}
    </>
  );
};

export default ControlPoint;
