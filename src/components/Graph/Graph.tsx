import { useCallback, useEffect, useRef, useState } from 'react';
import type { Mat2, Vec2 } from '@/types';
import { type Coord, FnPaths } from '@/models/FnPaths';
import { clamp, map } from '@/utils';
import { THUMB_INTERACTION_SIZE, THUMB_DISPLAY_SIZE } from './Graph.constants';
import { GraphProvider } from './Graph.provider';
import Link from './Graph.Link';
import Node from './Graph.Node';

type GraphProps = {
  paths: FnPaths;
  bound?: Mat2;
  thumbInteractionSize?: number;
  thumbDisplaySize?: number;
};

const Graph = ({
  paths,
  bound,
  thumbInteractionSize,
  thumbDisplaySize,
}: GraphProps) => {
  const elemRef = useRef<SVGSVGElement>(null);
  const elemSizeStates = useState<Vec2>([0, 0]);
  const [elemSizeState, setElemSizeState] = elemSizeStates;
  useEffect(() => {
    const observingTarget = elemRef.current;
    if (!observingTarget) return;
    let animationFrameId: number | null = null;
    const handleResize = () => {
      const elem = elemRef.current;
      if (!elem) return;
      const rect = elem.getBoundingClientRect();
      setElemSizeState((prev) => {
        if (prev[0] !== rect.width || prev[1] !== rect.height)
          return [rect.width, rect.height];
        return prev;
      });
    };
    const resizeObserver = new ResizeObserver(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleResize);
    });
    resizeObserver.observe(observingTarget);
    handleResize();
    return () => {
      resizeObserver.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [setElemSizeState]);

  const usedThumbInteractionSize =
    thumbInteractionSize || THUMB_INTERACTION_SIZE;
  const usedThumbDisplaySize = thumbDisplaySize || THUMB_DISPLAY_SIZE;
  const padding = 0.5 * usedThumbInteractionSize;
  const minPosX = padding;
  const minPosY = elemSizeState[1] - padding;
  const maxPosX = elemSizeState[0] - padding;
  const maxPosY = padding;
  const paddedWidth = elemSizeState[0] - 2 * padding;
  const paddedHeight = elemSizeState[1] - 2 * padding;

  const getBoundFromPath = (): Mat2 => {
    if (paths.pointCnt < 2)
      return [
        [0, 0],
        [1, 1],
      ];
    const firstX = paths.getPoint(0)!.coord[0];
    const lastX = paths.getPoint(paths.pointCnt - 1)!.coord[0];
    const yVals = paths.points.map((aPoint) => aPoint.coord[1]);
    const minY = Math.min(...yVals);
    const maxY = Math.max(...yVals);
    return [
      [firstX, minY],
      [lastX, maxY],
    ];
  };
  const boundFromPathRef = useRef<Mat2>(getBoundFromPath());
  const usedBound = bound || boundFromPathRef.current;
  const [minBound, maxBound] = usedBound;
  const coordToPos = useCallback(
    (coord: Coord): Coord => {
      return map(
        coord,
        minBound,
        maxBound,
        [minPosX, minPosY],
        [maxPosX, maxPosY]
      ) as Coord;
    },
    [minBound, maxBound, minPosX, minPosY, maxPosX, maxPosY]
  );
  const posToCoord = useCallback(
    (pos: Coord): Coord => {
      return map(
        pos,
        [minPosX, minPosY],
        [maxPosX, maxPosY],
        minBound,
        maxBound
      ) as Coord;
    },
    [minBound, maxBound, minPosX, minPosY, maxPosX, maxPosY]
  );
  const clampPos = useCallback(
    (pos: Coord): Coord =>
      clamp(pos, [minPosX, minPosY], [maxPosX, maxPosY]) as Coord,
    [minPosX, minPosY, maxPosX, maxPosY]
  );

  return (
    <svg
      ref={elemRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${elemSizeState[0]} ${elemSizeState[1]}`}
      style={{
        display: 'block',
        touchAction: 'none',
        overscrollBehavior: 'contain',
        width: '100%',
        height: '100%',
      }}
    >
      <GraphProvider
        coordToPos={coordToPos}
        posToCoord={posToCoord}
        clampPos={clampPos}
        thumbInteractionSize={usedThumbInteractionSize}
        thumbDisplaySize={usedThumbDisplaySize}
      >
        <rect
          x={padding}
          y={padding}
          width={Math.max(paddedWidth, 0)}
          height={Math.max(paddedHeight, 0)}
          fill="grey"
        />
        {paths.points.map((aPoint, idx) => {
          if (idx === 0) return null;
          return (
            <Link
              key={`graph-link-${aPoint.id}`}
              beginPt={paths.getPoint(idx - 1)!}
              endPt={aPoint}
              idx={idx}
            />
          );
        })}
        {paths.points.map((aPoint, idx) => {
          return (
            <Node key={`graph-point-${aPoint.id}`} point={aPoint} idx={idx} />
          );
        })}
      </GraphProvider>
    </svg>
  );
};

export default Graph;
