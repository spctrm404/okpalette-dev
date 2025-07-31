import type { Vec2, Mat2, Order } from './Grapher.types';
import { useCallback, useEffect, useRef, useState } from 'react';
import Links from './Links';
import Thumb from './Thumb';

type GrapherProps = {
  path: Vec2[];
  range2d?: Mat2;
  thumbSize?: number;
  onChange?: (points: Vec2[]) => void;
};

const getOrder = (idx: number, length: number): Order => {
  if (idx === 0) return 'first';
  if (idx === length - 1) return 'last';
  return 'middle';
};

const Grapher = ({ path, range2d, thumbSize, onChange }: GrapherProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<Vec2>([0, 0]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    let animationFrameId: number | null = null;

    const handleResize = () => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      setSize((prev) => {
        if (prev[0] !== rect.width || prev[1] !== rect.height)
          return [rect.width, rect.height];
        return prev;
      });
    };

    const resizeObserver = new window.ResizeObserver(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleResize);
    });
    resizeObserver.observe(svg);
    handleResize();
    return () => {
      resizeObserver.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const getRange2dFromPath = (path: Vec2[]): Mat2 => {
    if (path.length < 2)
      return [
        [0, 0],
        [1, 1],
      ];
    const x0 = path[0][0];
    const x1 = path[path.length - 1][0];
    const yVals = path.map((p) => p[1]);
    const yMin = Math.min(...yVals);
    const yMax = Math.max(...yVals);
    return [
      [x0, yMin],
      [x1, yMax],
    ];
  };

  const range2dFromPathRef = useRef<Mat2>(getRange2dFromPath(path));
  const usedRange2d = range2d || range2dFromPathRef.current;
  const usedThumbSize = thumbSize || 40;

  const getConstraint = useCallback(
    (order: Order, idx: number): Mat2 | undefined => {
      if (order === 'first') {
        return [
          [usedRange2d[0][0], usedRange2d[0][1]],
          [usedRange2d[0][0], usedRange2d[1][1]],
        ];
      } else if (order === 'last') {
        return [
          [usedRange2d[1][0], usedRange2d[0][1]],
          [usedRange2d[1][0], usedRange2d[1][1]],
        ];
      } else if (order === 'middle' && path.length > 2) {
        const prevX = path[idx - 1][0];
        const nextX = path[idx + 1][0];
        return [
          [prevX, usedRange2d[0][1]],
          [nextX, usedRange2d[1][1]],
        ];
      }
      return undefined;
    },
    [path, usedRange2d]
  );

  const handleThumbChange = useCallback(
    (idx: number, newVal: Vec2) => {
      if (path[idx][0] !== newVal[0] || path[idx][1] !== newVal[1]) {
        const newPath = [...path];
        newPath[idx] = newVal;
        onChange?.(newPath);
      }
    },
    [path, onChange]
  );

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${size[0]} ${size[1]}`}
      style={{
        display: 'block',
        touchAction: 'none',
        overscrollBehavior: 'contain',
        width: '100%',
        height: '100%',
      }}
    >
      <rect
        x={0.5 * usedThumbSize}
        y={0.5 * usedThumbSize}
        width={Math.max(size[0] - usedThumbSize, usedThumbSize)}
        height={Math.max(size[1] - usedThumbSize, usedThumbSize)}
        fill="grey"
      />
      <Links
        path={path}
        range2d={usedRange2d}
        parentSize={size}
        thumbSize={usedThumbSize}
      />
      {path.map((point, idx) => {
        const order = getOrder(idx, path.length);
        const constraint = getConstraint(order, idx);
        return (
          <Thumb
            key={`thumb-${idx}`}
            val={point}
            range2d={usedRange2d}
            parentSize={size}
            size={thumbSize}
            constraint={constraint}
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
