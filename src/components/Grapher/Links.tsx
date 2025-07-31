import type { Vec2, Mat2 } from './Grapher.types';
import { useCallback } from 'react';

type LinksProps = {
  path: Vec2[];
  range2d: Mat2;
  parentSize: Vec2;
  thumbSize?: number;
};

const Links = ({ path, range2d, parentSize, thumbSize }: LinksProps) => {
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

  // path 좌표 변환 및 SVG path d 생성
  const d = path
    .map((point, idx) => {
      const pos = valToPos(point);
      return `${idx === 0 ? 'M' : 'L'} ${pos[0]} ${pos[1]}`;
    })
    .join(' ');

  return (
    <>
      <defs>
        <clipPath id="links-clip">
          <rect
            x={padding}
            y={padding}
            width={Math.max(parentW - usedThumbSize, usedThumbSize)}
            height={Math.max(parentH - usedThumbSize, usedThumbSize)}
          />
        </clipPath>
      </defs>
      <path
        d={d}
        fill="transparent"
        stroke="black"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        clipPath="url(#links-clip)"
      />
    </>
  );
};
export default Links;
