import type { Mat2, Vec2 } from '@/types';
import { Paths } from '@MODELS/Paths';
import { THUMB_INTERACTION_SIZE, THUMB_DISPLAY_SIZE } from './Graph.constants';
import { GraphProvider } from './Graph.provider';
import { PathsProvider } from '@CONTEXTS/Paths';
import { SizeProvider } from '@CONTEXTS/Size';
import { useCallback, useRef, useState } from 'react';
import { clamp, map } from '@/utils';
import Point from './Point';
import Link from './Link';

type GraphProps = {
  pathsArray: number[][];
  bound?: Mat2;
  thumbInteractionSize?: number;
  thumbDisplaySize?: number;
};

const Graph = ({
  pathsArray,
  bound,
  thumbInteractionSize,
  thumbDisplaySize,
}: GraphProps) => {
  const pathsRef = useRef<Paths>(Paths.fromArray(pathsArray));

  const elemRef = useRef<SVGSVGElement>(null);
  const elemSizeStates = useState<Vec2>([0, 0]);
  const [[elemWidth, elemHeight]] = elemSizeStates;

  const usedThumbInteractionSize =
    thumbInteractionSize || THUMB_INTERACTION_SIZE;
  const usedThumbDisplaySize = thumbDisplaySize || THUMB_DISPLAY_SIZE;
  const padding = 0.5 * usedThumbInteractionSize;
  const minPosX = padding;
  const minPosY = elemHeight - padding;
  const maxPosX = elemWidth - padding;
  const maxPosY = padding;
  const paddedWidth = elemWidth - 2 * padding;
  const paddedHeight = elemHeight - 2 * padding;

  const getBoundFromPath = (): Mat2 => {
    if (pathsArray.length < 2)
      return [
        [0, 0],
        [1, 1],
      ];
    const firstX = pathsArray[0][0];
    const lastX = pathsArray[pathsArray.length - 1][0];
    const yVals = pathsArray.map((aPoint) => aPoint[1]);
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
  const [minCoordX, minCoordY] = minBound;
  const [maxCoordX, maxCoordY] = maxBound;

  const coordToPos = useCallback(
    (coord: Vec2): Vec2 => {
      return map(
        coord,
        minBound,
        maxBound,
        [minPosX, minPosY],
        [maxPosX, maxPosY]
      ) as Vec2;
    },
    [minBound, maxBound, minPosX, minPosY, maxPosX, maxPosY]
  );

  const posToCoord = useCallback(
    (pos: Vec2): Vec2 => {
      return map(
        pos,
        [minPosX, minPosY],
        [maxPosX, maxPosY],
        minBound,
        maxBound
      ) as Vec2;
    },
    [minBound, maxBound, minPosX, minPosY, maxPosX, maxPosY]
  );

  const clampPos = useCallback(
    (pos: Vec2): Vec2 =>
      clamp(pos, [minPosX, minPosY], [maxPosX, maxPosY]) as Vec2,
    [minPosX, minPosY, maxPosX, maxPosY]
  );

  const getConstraint = useCallback(
    (idx: number): Mat2 | undefined => {
      const path = pathsRef.current;
      const order =
        idx === 0 ? 'first' : idx === path.length - 1 ? 'last' : 'middle';
      if (order === 'first') {
        return [
          [minCoordX, minCoordY],
          [minCoordX, maxCoordY],
        ];
      } else if (order === 'last') {
        return [
          [maxCoordX, minCoordY],
          [maxCoordX, maxCoordY],
        ];
      } else if (order === 'middle') {
        const prevX = path.getPoint(idx - 1)!.coord[0];
        const nextX = path.getPoint(idx + 1)!.coord[0];
        return [
          [prevX, minCoordY],
          [nextX, maxCoordY],
        ];
      }
      return undefined;
    },
    [maxCoordX, maxCoordY, minCoordX, minCoordY]
  );

  return (
    <svg
      ref={elemRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${elemWidth} ${elemHeight}`}
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
      >
        <PathsProvider paths={pathsRef.current}>
          <SizeProvider
            observingTargetRef={elemRef}
            sizeStates={elemSizeStates}
          >
            <rect
              x={padding}
              y={padding}
              width={Math.max(paddedWidth, 0)}
              height={Math.max(paddedHeight, 0)}
              fill="grey"
            />
            {pathsRef.current.points.map((aPoint, idx) => {
              if (idx === 0) return null;
              return (
                <Link
                  key={`graph-link-${aPoint.uuid}`}
                  beginPoint={pathsRef.current.getPoint(idx - 1)!}
                  endPoint={aPoint}
                />
              );
            })}
            {pathsRef.current.points.map((aPoint) => {
              return (
                <Point key={`graph-point-${aPoint.uuid}`} point={aPoint} />
              );
            })}
          </SizeProvider>
        </PathsProvider>
      </GraphProvider>
    </svg>
  );
};

export default Graph;
