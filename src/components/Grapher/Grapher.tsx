import React, { useRef, useState, useEffect } from 'react';
import Thumb from './Thumb';

type Vec2 = [number, number];

type GrapherProps = {
  points: Vec2[];
  min?: Vec2;
  max?: Vec2;
  thumbDiameter?: number;
  onChange?: (points: Vec2[]) => void;
};

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export const Grapher = ({
  points,
  min,
  max,
  thumbDiameter = 20,
  onChange,
}: GrapherProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // 1. 초기화/크기 감지/최초 min/max 추론 (mount 시 1회)
  const [renderSize, setRenderSize] = useState<Vec2>([0, 0]);
  const autoMin = useRef<Vec2 | undefined>(undefined);
  const autoMax = useRef<Vec2 | undefined>(undefined);
  // 1. 크기 감지 (ResizeObserver)
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

  // 2. 최초 min/max 추론 (mount 시 1회만)
  useEffect(() => {
    // min/max가 undefined일 때만 최초 1회만 세팅
    if (
      min === undefined &&
      autoMin.current === undefined &&
      points.length > 0
    ) {
      autoMin.current = [points[0][0], Math.min(...points.map((p) => p[1]))];
    }
    if (
      max === undefined &&
      autoMax.current === undefined &&
      points.length > 0
    ) {
      autoMax.current = [
        points[points.length - 1][0],
        Math.max(...points.map((p) => p[1])),
      ];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 내부 좌표계 (고정)
  // 부모 크기 기준으로 viewBox 설정
  const thumbRadius = thumbDiameter / 2; // prop은 diameter, 실제 radius로 변환
  const strokeWidth = 2; // 픽셀 고정
  const svgWidth = Math.max(renderSize[0], 1);
  const svgHeight = Math.max(renderSize[1], 1);
  const padX = thumbRadius;
  const padY = thumbRadius;
  const graphWidth = svgWidth - padX * 2;
  const graphHeight = svgHeight - padY * 2;

  // 드래그 상태 관리
  // 2. 드래그 상태 관리
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<Vec2 | null>(null);
  const [localPoints, setLocalPoints] = useState<Vec2[]>(points);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // ...existing code...

  const computedMin: Vec2 = React.useMemo(
    () => min ?? autoMin.current ?? [0, 0],
    [min]
  );
  const computedMax: Vec2 = React.useMemo(
    () => max ?? autoMax.current ?? [1, 1],
    [max]
  );

  // 2. points prop 변경 시 localPoints 동기화 (동기화 역할)
  useEffect(() => {
    setLocalPoints(points);
  }, [points]);

  // x, y값을 SVG 좌표로 변환 (offset 적용, x/y 모두 min/max 쌍 사용)
  const toSvg = (p: Vec2) => ({
    x:
      ((p[0] - computedMin[0]) / (computedMax[0] - computedMin[0])) *
        graphWidth +
      padX,
    y:
      (1 - (p[1] - computedMin[1]) / (computedMax[1] - computedMin[1])) *
        graphHeight +
      padY,
  });

  // 드래그 시작
  const handlePointerDown = (idx: number, e: React.PointerEvent) => {
    e.preventDefault();
    setDragIdx(idx);
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const { x, y } = toSvg(localPoints[idx]);
    setDragOffset([cursor.x - x, cursor.y - y]);
  };

  // 드래그 중 window에 이벤트 바인딩
  // 5. 드래그 이벤트 바인딩
  useEffect(() => {
    if (dragIdx === null) return;
    const handleMove = (e: PointerEvent) => {
      // SVG 영역 내 좌표 변환
      const svg = svgRef.current;
      if (!svg) return;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      const newPoints = [...localPoints];
      const idx = dragIdx;
      const [dx, dy] = dragOffset || [0, 0];
      const svgX = cursor.x - dx;
      const svgY = cursor.y - dy;
      // x값은 이전 Thumb의 x값과 다음 Thumb의 x값 사이로 제한
      let minX = computedMin[0];
      let maxX = computedMax[0];
      if (idx > 0) minX = localPoints[idx - 1][0];
      if (idx < localPoints.length - 1) maxX = localPoints[idx + 1][0];
      let x = clamp(
        ((svgX - padX) / graphWidth) * (computedMax[0] - computedMin[0]) +
          computedMin[0],
        minX,
        maxX
      );
      // y 변환: normY = 1 - ((svgY - padY) / graphHeight)
      const normY = 1 - (svgY - padY) / graphHeight;
      const y = clamp(
        normY * (computedMax[1] - computedMin[1]) + computedMin[1],
        computedMin[1],
        computedMax[1]
      );
      if (idx === 0) {
        x = computedMin[0];
      } else if (idx === localPoints.length - 1) {
        x = computedMax[0];
      }
      newPoints[idx] = [x, y];
      setLocalPoints(newPoints);
      if (onChange) onChange(newPoints);
    };
    const handleUp = () => {
      setDragIdx(null);
      setDragOffset(null);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [
    dragIdx,
    dragOffset,
    localPoints,
    svgWidth,
    svgHeight,
    graphWidth,
    graphHeight,
    padX,
    padY,
    computedMin,
    computedMax,
    onChange,
  ]);

  // SVG path 생성
  const pathD = localPoints
    .map((p, i) => {
      const { x, y } = toSvg(p);
      return i === 0 ? `M${x},${y}` : `L${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={{
        display: 'block',
        touchAction: 'none',
        overscrollBehavior: 'contain',
        width: '100%',
        height: '100%',
      }}
    >
      {/* 그래프 영역 배경 (패딩 안쪽만) */}
      <rect
        x={padX}
        y={padY}
        width={graphWidth}
        height={graphHeight}
        fill="#f5f7fa"
      />
      {/* 그래프 라인 */}
      <path d={pathD} stroke="#1976d2" strokeWidth={strokeWidth} fill="none" />
      {/* 점들 (Thumb 컴포넌트로 분리) */}
      {localPoints.map((p, i) => {
        const { x, y } = toSvg(p);
        const color =
          i === 0 || i === localPoints.length - 1 ? '#d32f2f' : '#1976d2';
        return (
          <Thumb
            key={i}
            position={[x, y]}
            color={color}
            diameter={thumbDiameter}
            hovered={hoverIdx === i}
            pressed={dragIdx === i}
            onPointerDown={(e) => handlePointerDown(i, e)}
            onPointerEnter={() => setHoverIdx(i)}
            onPointerLeave={() => setHoverIdx(null)}
          />
        );
      })}
    </svg>
  );
};
