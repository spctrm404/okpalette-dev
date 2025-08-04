import type { Vec2, Mat2, Path } from './Grapher.types';
import { THUMB_INTERACTION_SIZE } from './Grapher.constants';
import { map } from '../../utils/math';
import { useCallback } from 'react';
import { mergeProps, useHover, usePress } from 'react-aria';
import classes from './_Link.module.scss';
import clsx from 'clsx';

type LinksProps = {
  beginPath: Path;
  endPath: Path;
  valsBound: Mat2;
  parentSize: Vec2;
  thumbSize?: number;
};

const Link = ({
  beginPath,
  endPath,
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

  const d = () => {
    const { type } = beginPath;
    const beginPos = valsToPos(beginPath.point);
    const endPos = valsToPos(endPath.point);
    const [beginX, beginY] = beginPos;
    const [endX, endY] = endPos;
    if (type === 'linear') {
      return `M${beginX},${beginY}L${endX},${endY}`;
    } else if (type === 'bezier') {
      const { relativeControlPoint1, relativeControlPoint2 } = beginPath;
      const [c1X, c1Y] = map(
        relativeControlPoint1,
        [0, 0],
        [1, 1],
        beginPos,
        endPos
      );
      const [c2X, c2Y] = map(
        relativeControlPoint2,
        [0, 0],
        [1, 1],
        beginPos,
        endPos
      );
      return `M${beginX},${beginY}C${c1X},${c1Y},${c2X},${c2Y},${endX},${endY}`;
    } else if (type === 'pow') {
      const exponent = beginPath.exponent;
      const resolution = 64;
      let d = `M${beginX},${beginY}`;
      for (let n = 1; n <= resolution; ++n) {
        const normalizedX = n / resolution;
        const powedY = Math.pow(normalizedX, exponent);
        const x = map(normalizedX, 0, 1, beginX, endX);
        const y = map(powedY, 0, 1, beginY, endY);
        d += `L${x},${y}`;
      }
      return d;
    }
  };

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
