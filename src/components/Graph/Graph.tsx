import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Mat2, Vec2 } from '@/types';
import { Observable } from '@/models/Observable';
import { clamp, map } from '@/utils';
import { useFnPathsContext } from '@/contexts/FnPaths/context';
import { THUMB_INTERACTION_SIZE, THUMB_DISPLAY_SIZE } from './Graph.constants';
import { GraphProvider } from './Graph.provider';
import Link from './Graph.Link';
import Node from './Graph.Node';
import FnIntersection from './Graph.FnIntersection';

export type ObsProps = {
  pointerPos: Vec2;
  // 이 부분 사용할지 판단 필요
  selectedPointId: string | null;
};

type GraphProps = {
  coordRangeY?: Vec2;
  thumbInteractionSize?: number;
  thumbDisplaySize?: number;
  onSelectThumb?: (index: number) => void;
};

const Graph = ({
  coordRangeY,
  thumbInteractionSize,
  thumbDisplaySize,
  onSelectThumb,
}: GraphProps) => {
  const { fnPaths } = useFnPathsContext();

  const elem = useRef<SVGSVGElement>(null);
  const [elemSize, setElemSize] = useState<Vec2>([0, 0]);
  useEffect(() => {
    const observingTarget = elem.current;
    if (!observingTarget) return;
    let animationFrameId: number | null = null;
    const handleResize = () => {
      const rect = observingTarget.getBoundingClientRect();
      setElemSize((prev) => {
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
  }, [setElemSize]);

  const getCoordBoundFromPath = (): Mat2 => {
    if (fnPaths.pointCnt < 2)
      return [
        [0, 0],
        [1, 1],
      ];
    const firstCoordX = fnPaths.getPoint(0)!.coord[0];
    const lastCoordX = fnPaths.getPoint(fnPaths.pointCnt - 1)!.coord[0];
    const arryCoordY = fnPaths.points.map((aPoint) => aPoint.coord[1]);
    const minY = Math.min(...arryCoordY);
    const maxY = Math.max(...arryCoordY);
    return [
      [firstCoordX, minY],
      [lastCoordX, maxY],
    ];
  };
  const coordBoundFromPath = useRef<Mat2>(getCoordBoundFromPath()).current;
  const usedCoordBound = useMemo(() => {
    return coordRangeY
      ? [
          [coordBoundFromPath[0][0], coordRangeY[0]],
          [coordBoundFromPath[1][0], coordRangeY[1]],
        ]
      : coordBoundFromPath;
  }, [coordRangeY, coordBoundFromPath]);

  const usedThumbInteractionSize =
    thumbInteractionSize || THUMB_INTERACTION_SIZE;
  const usedThumbDisplaySize = thumbDisplaySize || THUMB_DISPLAY_SIZE;

  const padding = 0.5 * usedThumbInteractionSize;
  const minPosX = padding;
  const minPosY = elemSize[1] - padding;
  const maxPosX = elemSize[0] - padding;
  const maxPosY = padding;
  const paddedWidth = elemSize[0] - 2 * padding;
  const paddedHeight = elemSize[1] - 2 * padding;

  const coordToPos = useCallback(
    (coord: Vec2): Vec2 => {
      return map(
        coord,
        usedCoordBound[0],
        usedCoordBound[1],
        [minPosX, minPosY],
        [maxPosX, maxPosY]
      ) as Vec2;
    },
    [usedCoordBound, minPosX, minPosY, maxPosX, maxPosY]
  );
  const posToCoord = useCallback(
    (pos: Vec2): Vec2 => {
      return map(
        pos,
        [minPosX, minPosY],
        [maxPosX, maxPosY],
        usedCoordBound[0],
        usedCoordBound[1]
      ) as Vec2;
    },
    [usedCoordBound, minPosX, minPosY, maxPosX, maxPosY]
  );
  const clampPos = useCallback(
    (pos: Vec2): Vec2 =>
      clamp(pos, [minPosX, minPosY], [maxPosX, maxPosY]) as Vec2,
    [minPosX, minPosY, maxPosX, maxPosY]
  );

  const renderLinks = useMemo(
    () =>
      fnPaths.points.map((aPoint, idx) => {
        if (idx === 0) return;
        return (
          <Link
            key={`graph-link-${aPoint.id}`}
            beginPt={fnPaths.getPoint(idx - 1)!}
            endPt={aPoint}
            idx={idx}
          />
        );
      }),
    [fnPaths]
  );
  const renderNodes = useMemo(
    () =>
      fnPaths.points.map((aPoint, idx) => {
        return (
          <Node
            key={`graph-point-${aPoint.id}`}
            point={aPoint}
            idx={idx}
            onSelectThumb={onSelectThumb}
          />
        );
      }),
    [fnPaths, onSelectThumb]
  );

  const observable = useRef<Observable<ObsProps>>(
    new Observable<ObsProps>({
      pointerPos: [0, 0],
      selectedPointId: null,
    })
  ).current;
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const { offsetX, offsetY } = e.nativeEvent;
      observable.props = { pointerPos: [offsetX, offsetY] };
    },
    [observable]
  );

  const paddedSize = useMemo<Vec2>(
    () => [Math.max(paddedWidth, 0), Math.max(paddedHeight, 0)],
    [paddedWidth, paddedHeight]
  );
  const posBound = useMemo<Mat2>(
    () => [
      [minPosX, minPosY],
      [maxPosX, maxPosY],
    ],
    [minPosX, minPosY, maxPosX, maxPosY]
  );

  return (
    <svg
      ref={elem}
      width="100%"
      height="100%"
      viewBox={`0 0 ${elemSize[0]} ${elemSize[1]}`}
      style={{
        display: 'block',
        touchAction: 'none',
        overscrollBehavior: 'contain',
        width: '100%',
        height: '100%',
      }}
      onPointerMove={handlePointerMove}
    >
      <GraphProvider
        observable={observable}
        coordToPos={coordToPos}
        posToCoord={posToCoord}
        clampPos={clampPos}
        padding={padding}
        paddedSize={paddedSize}
        posBound={posBound}
        thumbInteractionSize={usedThumbInteractionSize}
        thumbDisplaySize={usedThumbDisplaySize}
      >
        <rect
          x={padding}
          y={padding}
          width={paddedSize[0]}
          height={paddedSize[1]}
          fill="grey"
        />
        <FnIntersection />
        {renderLinks}
        {renderNodes}
      </GraphProvider>
    </svg>
  );
};

export default Graph;
