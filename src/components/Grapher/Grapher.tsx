import type { Vec2, Mat2, Order, Path } from './Grapher.types';
import {
  THUMB_DISPLAY_SIZE,
  THUMB_INTERACTION_SIZE,
} from './Grapher.constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from './Link';
import Thumb from './Thumb';

type GrapherProps = {
  path: Path;
  bound?: Mat2;
  thumbInteractionSize?: number;
  thumbDisplaySize?: number;
  onChange?: (path: Path) => void;
};

function getOrder(idx: number, length: number): Order {
  if (idx === 0) return 'first';
  if (idx === length - 1) return 'last';
  return 'middle';
}

const Grapher = ({
  path,
  bound,
  thumbInteractionSize,
  thumbDisplaySize,
  onChange,
}: GrapherProps) => {
  function getBound2dFromPath(): Mat2 {
    if (path.length < 2)
      return [
        [0, 0],
        [1, 1],
      ];
    const firstX = path[0].vals[0];
    const lastX = path[path.length - 1].vals[0];
    const yVals = path.map((aPoint) => aPoint.vals[1]);
    const minY = Math.min(...yVals);
    const maxY = Math.max(...yVals);
    return [
      [firstX, minY],
      [lastX, maxY],
    ];
  }

  const boundFromPathRef = useRef<Mat2>(getBound2dFromPath());
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
        const prevX = path[idx - 1].vals[0];
        const nextX = path[idx + 1].vals[0];
        return [
          [prevX, minY],
          [nextX, maxY],
        ];
      }
      return undefined;
    },
    [path, maxX, maxY, minX, minY]
  );

  const handleThumbChange = useCallback(
    (idx: number, newVal: Vec2) => {
      if (path[idx].vals[0] !== newVal[0] || path[idx].vals[1] !== newVal[1]) {
        const newPath = [...path];
        newPath[idx].vals = newVal;
        onChange?.(newPath);
      }
    },
    [path, onChange]
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
            valsBound={usedBound}
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
            vals={aPoint.vals}
            valsBound={usedBound}
            parentSize={sizeState}
            interactionSize={usedThumbInteractionSize}
            displaySize={usedThumbDisplaySize}
            valsConstraint={constraint}
            tabIndex={idx + 1}
            onChange={(newValue) => handleThumbChange(idx, newValue)}
            order={order}
          />
        );
      })}
    </svg>
  );
};
export default Grapher;
