import React, { useRef, useState, useEffect } from 'react';
import Thumb from './Thumb';

type Point = [number, number];

interface GrapherProps {
  points: Point[];
  range: { min: Point; max: Point };
  width?: number;
  height?: number;
  thumbSize?: number;
  onChange?: (points: Point[]) => void;
}

const DEFAULT_THUMB_SIZE = 40;
const POINT_RADIUS = DEFAULT_THUMB_SIZE / 2;

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export const Grapher: React.FC<GrapherProps> = ({
  points,
  range,
  width = 400,
  height = 300,
  thumbSize = DEFAULT_THUMB_SIZE,
  onChange,
}) => {
  const offset = thumbSize / 2;
  const svgWidth = width + offset * 2;
  const svgHeight = height + offset * 2;

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{
    dx: number;
    dy: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [localPoints, setLocalPoints] = useState(points);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // points prop이 변경될 때 localPoints도 동기화
  useEffect(() => {
    setLocalPoints(points);
  }, [points]);

  // x, y값을 SVG 좌표로 변환 (offset 적용, x/y 모두 min/max 쌍 사용)
  const toSvg = (p: Point) => ({
    x: ((p[0] - range.min[0]) / (range.max[0] - range.min[0])) * width + offset,
    y:
      height -
      ((p[1] - range.min[1]) / (range.max[1] - range.min[1])) * height +
      offset,
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
    setDragOffset({ dx: cursor.x - x, dy: cursor.y - y });
  };

  // 드래그 중 window에 이벤트 바인딩
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
      const { dx, dy } = dragOffset || { dx: 0, dy: 0 };
      const svgX = cursor.x - dx - offset;
      const svgY = cursor.y - dy - offset;
      let x = clamp(
        (svgX / width) * (range.max[0] - range.min[0]) + range.min[0],
        range.min[0],
        range.max[0]
      );
      let y = clamp(
        ((height - svgY) / height) * (range.max[1] - range.min[1]) +
          range.min[1],
        range.min[1],
        range.max[1]
      );
      if (idx === 0) {
        x = range.min[0];
      } else if (idx === localPoints.length - 1) {
        x = range.max[0];
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
    offset,
    width,
    height,
    range,
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
      width={svgWidth}
      height={svgHeight}
      style={{
        border: '1px solid #ccc',
        touchAction: 'none',
        overscrollBehavior: 'contain',
      }}
    >
      {/* 그래프 라인 */}
      <path d={pathD} stroke="#1976d2" strokeWidth={2} fill="none" />
      {/* 점들 (Thumb 컴포넌트로 분리) */}
      {localPoints.map((p, i) => {
        const { x, y } = toSvg(p);
        const color =
          i === 0 || i === localPoints.length - 1 ? '#d32f2f' : '#1976d2';
        return (
          <Thumb
            key={i}
            x={x}
            y={y}
            color={color}
            radius={POINT_RADIUS}
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
