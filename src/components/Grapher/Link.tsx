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
  valsBound: Mat2;
  parentSize: Vec2;
  thumbSize?: number;
};

const Link = ({
  point,
  prevPoint,
  valsBound,
  parentSize,
  thumbSize,
}: LinksProps) => {
  const [minVals, maxVals] = valsBound;
  const [parentW, parentH] = parentSize;
  const usedThumbSize = thumbSize || THUMB_INTERACTION_SIZE;
  const padding = 0.5 * usedThumbSize;
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

  const { vals: beginVals } = prevPoint;
  const beginPos = valsToPos(beginVals);
  const [beginX, beginY] = beginPos;
  const beginType =
    'relNextCpVals' in prevPoint
      ? 'bezier'
      : 'exponent' in prevPoint
      ? 'pow'
      : 'linear';

  const { vals: endVals } = point;
  const endPos = valsToPos(endVals);
  const [endX, endY] = endPos;
  const endType =
    'relPrevCpVals' in point
      ? 'bezier'
      : 'exponent' in point
      ? 'pow'
      : 'linear';

  const absCp1Vals =
    'relNextCpVals' in prevPoint
      ? (map(
          prevPoint.relNextCpVals,
          [0, 0],
          [1, 1],
          beginVals,
          endVals
        ) as Vec2)
      : beginVals;
  const [cp1X, cp1Y] = valsToPos(absCp1Vals);

  const absCp2Vals =
    'relPrevCpVals' in point
      ? (map(point.relPrevCpVals, [0, 0], [1, 1], endVals, beginVals) as Vec2)
      : endVals;
  const [cp2X, cp2Y] = valsToPos(absCp2Vals);

  const exponent = 'exponent' in prevPoint ? prevPoint.exponent : 1;

  const d = useCallback(() => {
    let d = `M${beginX},${beginY}`;
    if (beginType === 'linear' && endType === 'linear') {
      d += `L${endX},${endY}`;
    } else if (beginType === 'bezier' || endType === 'bezier') {
      d += `C${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
    } else if (beginType === 'pow') {
      const resolution = 64;
      for (let n = 1; n <= resolution; ++n) {
        const normalizedX = n / resolution;
        const powedY = Math.pow(normalizedX, exponent);
        const x = map(normalizedX, 0, 1, beginX, endX);
        const y = map(powedY, 0, 1, beginY, endY);
        d += `L${x},${y}`;
      }
    }
    return d;
  }, [
    beginType,
    beginX,
    beginY,
    endType,
    endX,
    endY,
    cp1X,
    cp1Y,
    cp2X,
    cp2Y,
    exponent,
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
      <path
        d={`M${beginX},${beginY} L${cp1X},${cp1Y}`}
        fill="none"
        stroke="black"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={`M${endX},${endY} L${cp2X},${cp2Y}`}
        fill="none"
        stroke="black"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
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
