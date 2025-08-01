import type { Vec2, Mat2 } from './Grapher.types';
import { useCallback, useRef } from 'react';

type LinksProps = {
  path: Vec2[];
  beginIdx: number;
  range2d: Mat2;
  parentSize: Vec2;
  thumbSize?: number;
};

const Links = ({
  path,
  beginIdx,
  range2d,
  parentSize,
  thumbSize,
}: LinksProps) => {
  const [[minValX, minValY], [maxValX, maxValY]] = range2d;
  const [parentW, parentH] = parentSize;
  const usedThumbSize = thumbSize || 40;
  const padding = 0.5 * usedThumbSize;
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

  const beginPos = valToPos(path[beginIdx]);
  const endPos = valToPos(path[beginIdx + 1]);
  const d = `M${beginPos[0]},${beginPos[1]} L${endPos[0]},${endPos[1]}`;
  const pathRef = useRef<SVGPathElement>(null);

  return (
    <>
      <g clipPath="url(#links-clip)">
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="black"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={d}
          fill="none"
          stroke="transparent"
          strokeWidth="16"
          strokeLinejoin="round"
          strokeLinecap="round"
          cursor={'pointer'}
          onMouseEnter={() => {
            const path = pathRef.current;
            if (!path) return;
            path.style.strokeWidth = '2';
          }}
          onMouseLeave={() => {
            const path = pathRef.current;
            if (!path) return;
            path.style.strokeWidth = '1';
          }}
        />
      </g>
    </>
  );
};
export default Links;
