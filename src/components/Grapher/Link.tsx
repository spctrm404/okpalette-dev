import type { Vec2, Mat2 } from './Grapher.types';
import { THUMB_INTERACTION_SIZE } from './Grapher.constants';
import { map } from '../../utils/math';
import { useCallback } from 'react';
import { mergeProps, useHover, usePress } from 'react-aria';
import classes from './_Link.module.scss';
import clsx from 'clsx';

type LinksProps = {
  beginVals: Vec2;
  endVals: Vec2;
  valsBound: Mat2;
  parentSize: Vec2;
  thumbSize?: number;
};

const Link = ({
  beginVals,
  endVals,
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

  const beginPos = valsToPos(beginVals);
  const endPos = valsToPos(endVals);
  const trimLine = (
    [beginX, beginY]: Vec2,
    [endX, endY]: Vec2,
    trimLength: number
  ): [Vec2, Vec2] => {
    const dx = endX - beginX;
    const dy = endY - beginY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0 || trimLength === 0 || len < trimLength)
      return [
        [beginX, beginY],
        [endX, endY],
      ];
    const ux = dx / len;
    const uy = dy / len;
    const newBegin: Vec2 = [beginX + ux * trimLength, beginY + uy * trimLength];
    const newEnd: Vec2 = [endX - ux * trimLength, endY - uy * trimLength];
    return [newBegin, newEnd];
  };

  // const [[beginX, beginY], [endX, endY]] = trimLine(
  //   beginPos,
  //   endPos,
  //   usedThumbSize / 2
  // );
  const [[beginX, beginY], [endX, endY]] = [beginPos, endPos];
  const d = `M${beginX},${beginY} L${endX},${endY}`;

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
          d={d}
          fill="none"
          stroke="black"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          className={clsx(classes.interaction)}
          {...racProps}
          d={d}
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
