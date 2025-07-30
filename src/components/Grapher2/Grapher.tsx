import { useEffect, useRef, useState } from 'react';
import { Thumb } from './Thumb';

type Vec2 = [number, number];

type GrapherProps = {
  path: Vec2[];
  range2d?: [Vec2, Vec2];
  thumbSize?: number;
  onChange?: (points: Vec2[]) => void;
};

export const Grapher = ({
  path,
  range2d,
  thumbSize,
  onChange,
}: GrapherProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [renderSize, setRenderSize] = useState<Vec2>([0, 0]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    let animationFrameId: number | null = null;

    const handleResize = () => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      setRenderSize((prev) => {
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

  const inferRange2dFromPath = (path: Vec2[]): [Vec2, Vec2] => {
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

  const inferredRange2dRef = useRef<[Vec2, Vec2]>(inferRange2dFromPath(path));
  const usedRange2d = range2d || inferredRange2dRef.current;

  // order 계산 함수
  const getOrder = (
    index: number,
    length: number
  ): 'first' | 'middle' | 'last' => {
    if (index === 0) return 'first';
    if (index === length - 1) return 'last';
    return 'middle';
  };

  // constraint 계산 함수
  const getConstraint = (
    order: 'first' | 'middle' | 'last',
    index: number,
    path: Vec2[],
    usedRange2d: [Vec2, Vec2]
  ): [Vec2, Vec2] | undefined => {
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
      const prevX = path[index - 1][0];
      const nextX = path[index + 1][0];
      return [
        [prevX, usedRange2d[0][1]],
        [nextX, usedRange2d[1][1]],
      ];
    }
    return undefined;
  };

  // onChange 핸들러 함수
  const handleThumbChange = (index: number, newValue: Vec2) => {
    if (path[index][0] !== newValue[0] || path[index][1] !== newValue[1]) {
      const newPath = [...path];
      newPath[index] = newValue;
      onChange?.(newPath);
    }
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${renderSize[0]} ${renderSize[1]}`}
      style={{
        display: 'block',
        touchAction: 'none',
        overscrollBehavior: 'contain',
        width: '100%',
        height: '100%',
      }}
    >
      {path.map((point, index) => {
        const order = getOrder(index, path.length);
        const constraint = getConstraint(order, index, path, usedRange2d);
        return (
          <Thumb
            key={index}
            val={point}
            range2d={usedRange2d}
            parentSize={renderSize}
            size={thumbSize}
            constraint={constraint}
            tabIndex={index + 1}
            onChange={(newValue) => handleThumbChange(index, newValue)}
            order={order}
          />
        );
      })}
    </svg>
  );
};
