import type { Vec2, Mat2, Point } from './Grapher.types';
import { THUMB_INTERACTION_SIZE } from './Grapher.constants';
import { map } from '../../utils/math';
import { useCallback } from 'react';
import { mergeProps, useHover, usePress } from 'react-aria';
import classes from './_Link.module.scss';
import clsx from 'clsx';

type LinksProps = {
  point: Point;
  prevPoint: Point;
  bound: Mat2;
  parentSize: Vec2;
  thumbSize?: number;
};

const Link = ({
  point,
  prevPoint,
  bound,
  parentSize,
  thumbSize,
}: LinksProps) => {
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
    [minPosX, minPosY, maxPosX, maxPosY, maxVal, minVal]
  );

  const { val: beginVal } = prevPoint;
  const beginPos = valToPos(beginVal);
  const [beginPosX, beginPosY] = beginPos;
  const beginType =
    'nextCpRelVal' in prevPoint
      ? 'bezier'
      : 'exponent' in prevPoint
      ? 'pow'
      : 'linear';

  const { val: endVal } = point;
  const endPos = valToPos(endVal);
  const [endPosX, endPosY] = endPos;
  const endType =
    'prevCpRelVal' in point ? 'bezier' : 'exponent' in point ? 'pow' : 'linear';

  const exponent = 'exponent' in prevPoint ? prevPoint.exponent : 1;

  const d = useCallback(() => {
    let d = `M${beginPosX},${beginPosY}`;
    if (beginType === 'linear' && endType === 'linear') {
      d += `L${endPosX},${endPosY}`;
    } else if (beginType === 'bezier' || endType === 'bezier') {
      const cp1AbsVal =
        'nextCpRelVal' in prevPoint
          ? (map(
              prevPoint.nextCpRelVal,
              [0, 0],
              [1, 1],
              beginVal,
              endVal
            ) as Vec2)
          : beginVal;
      const [cp1PosX, cp1PosY] = valToPos(cp1AbsVal);
      const cp2AbsVal =
        'prevCpRelVal' in point
          ? (map(point.prevCpRelVal, [0, 0], [1, 1], endVal, beginVal) as Vec2)
          : endVal;
      const [cp2PosX, cp2PosY] = valToPos(cp2AbsVal);
      d += `C${cp1PosX},${cp1PosY} ${cp2PosX},${cp2PosY} ${endPosX},${endPosY}`;
    } else if (beginType === 'pow') {
      const resolution = 64;
      for (let n = 1; n <= resolution; ++n) {
        const normalizedX = n / resolution;
        const powedY = Math.pow(normalizedX, exponent);
        const posX = map(normalizedX, 0, 1, beginPosX, endPosX);
        const posY = map(powedY, 0, 1, beginPosY, endPosY);
        d += `L${posX},${posY}`;
      }
    }
    return d;
  }, [
    point,
    prevPoint,
    beginType,
    beginVal,
    beginPosX,
    beginPosY,
    endType,
    endVal,
    endPosX,
    endPosY,
    exponent,
    valToPos,
  ]);

  const { hoverProps, isHovered } = useHover({
    onHoverStart: () => {},
    onHoverEnd: () => {},
  });
  const { pressProps, isPressed } = usePress({
    onPressStart: () => {},
    onPressEnd: () => {},
    onPress: () => {},
  });

  const racProps = mergeProps(hoverProps, pressProps);

  return (
    <>
      <g
        className={clsx(classes.container)}
        data-hovered={isHovered}
        data-pressed={isPressed}
        clipPath="url(#links-clip)"
      >
        <path
          className={clsx(classes.display)}
          d={d()}
          fill="none"
          stroke="black"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          className={clsx(classes.interaction)}
          {...racProps}
          d={d()}
          fill="none"
          stroke="transparent"
          strokeWidth="16"
          strokeLinejoin="round"
          strokeLinecap="butt"
        />
      </g>
    </>
  );
};
export default Link;
