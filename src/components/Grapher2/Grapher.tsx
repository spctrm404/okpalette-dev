import { useEffect, useRef, useState } from 'react';
import { Thumb } from './Thumb';

type Vec2 = [number, number];

type GrapherProps = {
  path: Vec2[];
  range?: [Vec2, Vec2];
  size?: Vec2;
  thumbSize?: number;
  onChange?: (points: Vec2[]) => void;
};

export const Grapher = ({
  path,
  range,
  size,
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
      console.log('resize');
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

  // range, constraint, size 기본값 처리
  const defaultRange: [Vec2, Vec2] = [
    [0, 0],
    [1, 1],
  ];
  const usedRange = range || defaultRange;
  const usedConstraint = [[...usedRange[0]], [...usedRange[1]]] as [Vec2, Vec2];
  const usedSize = thumbSize || 40;

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
        const isFirst = index === 0;
        const isLast = index === path.length - 1;
        const order: 'first' | 'middle' | 'last' = isFirst
          ? 'first'
          : isLast
          ? 'last'
          : 'middle';
        return (
          <Thumb
            key={index}
            tabIndex={index + 1}
            parentSize={renderSize}
            val={point}
            range={usedRange}
            constraint={usedConstraint}
            size={usedSize}
            onChange={(newValue) => {
              // 값이 바뀌었을 때만 업데이트
              if (
                path[index][0] !== newValue[0] ||
                path[index][1] !== newValue[1]
              ) {
                const newPath = [...path];
                newPath[index] = newValue;
                onChange?.(newPath);
              }
            }}
            order={order}
          />
        );
      })}
    </svg>
  );
};
