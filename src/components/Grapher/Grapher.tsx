import type { Vec2, Mat2, Order, Path, Point } from './Grapher.types';
import {
  THUMB_DISPLAY_SIZE,
  THUMB_INTERACTION_SIZE,
} from './Grapher.constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from './Link';
import Thumb from './Thumb';
import { map } from '../../utils/math';

type GrapherProps = {
  path: Path;
  bound?: Mat2;
  thumbInteractionSize?: number;
  thumbDisplaySize?: number;
  onThumbMoving?: (path: Path) => void;
  onThumbSelect?: (idx: number, point: Point) => void;
};

const getOrder = (idx: number, length: number): Order => {
  if (idx === 0) return 'first';
  if (idx === length - 1) return 'last';
  return 'middle';
};

const Grapher = ({
  path,
  bound,
  thumbInteractionSize,
  thumbDisplaySize,
  onThumbMoving,
  onThumbSelect,
}: GrapherProps) => {
  const getBoundFromPath = (): Mat2 => {
    if (path.length < 2)
      return [
        [0, 0],
        [1, 1],
      ];
    const firstX = path[0].val[0];
    const lastX = path[path.length - 1].val[0];
    const yVals = path.map((aPoint) => aPoint.val[1]);
    const minY = Math.min(...yVals);
    const maxY = Math.max(...yVals);
    return [
      [firstX, minY],
      [lastX, maxY],
    ];
  };

  const boundFromPathRef = useRef<Mat2>(getBoundFromPath());
  const usedBound = bound || boundFromPathRef.current;
  const [[minX, minY], [maxX, maxY]] = usedBound;

  const getConstraint = useCallback(
    (order: Order, idx: number): Mat2 | undefined => {
      if (order === 'first') {
        return [
          [minX, minY],
          [minX, maxY],
        ];
      } else if (order === 'last') {
        return [
          [maxX, minY],
          [maxX, maxY],
        ];
      } else if (order === 'middle') {
        const prevX = path[idx - 1].val[0];
        const nextX = path[idx + 1].val[0];
        return [
          [prevX, minY],
          [nextX, maxY],
        ];
      }
      return undefined;
    },
    [path, maxX, maxY, minX, minY]
  );

  const svgElemRef = useRef<SVGSVGElement>(null);
  const [sizeState, setSizeState] = useState<Vec2>([0, 0]);

  useEffect(() => {
    const svgElem = svgElemRef.current;
    if (!svgElem) return;
    let animationFrameId: number | null = null;
    const handleResize = () => {
      const svgElem = svgElemRef.current;
      if (!svgElem) return;
      const rect = svgElem.getBoundingClientRect();
      setSizeState((prev) => {
        if (prev[0] !== rect.width || prev[1] !== rect.height)
          return [rect.width, rect.height];
        return prev;
      });
    };
    const resizeObserver = new window.ResizeObserver(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleResize);
    });
    resizeObserver.observe(svgElem);
    handleResize();
    return () => {
      resizeObserver.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleThumbMoving = useCallback(
    (idx: number, newVal: Vec2) => {
      const currentPoint = path[idx];
      const [currentX, currentY] = currentPoint.val;
      const [newX, newY] = newVal;
      if (currentX !== newX || currentY !== newY) {
        const newPath = [...path];
        newPath[idx] = { ...currentPoint, val: newVal };
        onThumbMoving?.(newPath);
      }
    },
    [path, onThumbMoving]
  );

  const [selectedThumbIdxState, setSelectedThumbIdxState] = useState<number>(0);

  const handleThumbSelect = useCallback(
    (idx: number) => {
      setSelectedThumbIdxState(idx);
      onThumbSelect?.(idx, path[idx]);
    },
    [onThumbSelect, path]
  );

  const usedThumbInteractionSize =
    thumbInteractionSize || THUMB_INTERACTION_SIZE;
  const usedThumbDisplaySize = thumbDisplaySize || THUMB_DISPLAY_SIZE;
  const padding = 0.5 * usedThumbInteractionSize;

  return (
    <svg
      ref={svgElemRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${sizeState[0]} ${sizeState[1]}`}
      style={{
        display: 'block',
        touchAction: 'none',
        overscrollBehavior: 'contain',
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        <clipPath id="links-clip">
          <rect
            x={padding}
            y={padding}
            width={Math.max(
              sizeState[0] - usedThumbInteractionSize,
              usedThumbInteractionSize
            )}
            height={Math.max(
              sizeState[1] - usedThumbInteractionSize,
              usedThumbInteractionSize
            )}
          />
        </clipPath>
      </defs>
      <rect
        x={padding}
        y={padding}
        width={Math.max(
          sizeState[0] - usedThumbInteractionSize,
          usedThumbInteractionSize
        )}
        height={Math.max(
          sizeState[1] - usedThumbInteractionSize,
          usedThumbInteractionSize
        )}
        fill="grey"
      />
      {path.map((aPoint, idx) => {
        if (idx === 0) return null;
        return (
          <Link
            key={`link-${idx}`}
            point={aPoint}
            prevPoint={path[idx - 1]}
            bound={usedBound}
            parentSize={sizeState}
            thumbSize={usedThumbInteractionSize}
          />
        );
      })}
      {path.map((aPoint, idx) => {
        const order = getOrder(idx, path.length);
        const constraint = getConstraint(order, idx);
        return (
          <Thumb
            key={`thumb-${idx}`}
            val={aPoint.val}
            bound={usedBound}
            parentSize={sizeState}
            interactionSize={usedThumbInteractionSize}
            displaySize={usedThumbDisplaySize}
            constraint={constraint}
            tabIndex={idx + 1}
            onMoving={(newValue) => handleThumbMoving(idx, newValue)}
            onSelect={() => handleThumbSelect(idx)}
            isSelected={idx === selectedThumbIdxState}
            order={order}
          />
        );
      })}
    </svg>
  );
};
export default Grapher;
