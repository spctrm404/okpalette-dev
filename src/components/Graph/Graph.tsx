import React, { useRef, useState } from 'react';

interface GraphProps {
  type: 'linear' | 'pow' | 'bezier';
  value: any; // 함수 파라미터 (linear: {a, b}, pow: {a}, bezier: {p0, p1, c0, c1})
  onChange?: (value: any) => void;
  width?: number;
  height?: number;
  thumbSize?: number;
}

const PADDING = 8; // 그래프 영역 패딩 (thumbSize/2와 동일하게 조정)

// 0~1 좌표를 SVG 좌표로 변환 (좌측하단 원점)
function toSvgCoords(x: number, y: number, width: number, height: number) {
  return [
    PADDING + x * (width - 2 * PADDING),
    height - PADDING - y * (height - 2 * PADDING),
  ] as [number, number];
}

// SVG 좌표를 0~1 좌표로 변환
function fromSvgCoords(
  svgX: number,
  svgY: number,
  width: number,
  height: number
) {
  return [
    (svgX - PADDING) / (width - 2 * PADDING),
    (height - PADDING - svgY) / (height - 2 * PADDING),
  ] as [number, number];
}

// 선형 함수 y = a*x + b
function linearFunc(a: number, b: number, x: number) {
  return a * x + b;
}

const Graph = ({
  type,
  value,
  onChange,
  width = 320,
  height = 240,
  thumbSize = 16,
}: GraphProps) => {
  // 선형/거듭제곱: 시작점, 끝점만 조작
  // bezier: 시작, 끝, 컨트롤포인트 조작
  // value: {a, b} (linear), {a} (pow), {p0, p1, c0, c1} (bezier)

  // linear, pow: 시작점/끝점 고정, thumb 없음
  // bezier: 컨트롤포인트만 thumb로 조작
  const [ctrlPoints, setCtrlPoints] = useState(() => {
    if (type === 'bezier') {
      return [value.c0, value.c1];
    }
    return [];
  });

  // 드래그 상태 (bezier 컨트롤포인트만)
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // 드래그 시작 (bezier 컨트롤포인트만)
  const handleThumbMouseDown = (idx: number, e: React.MouseEvent) => {
    if (type !== 'bezier') return;
    e.preventDefault();
    setDragIdx(idx);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 드래그 중 (bezier 컨트롤포인트만)
  const handleMouseMove = (e: MouseEvent) => {
    if (type !== 'bezier' || dragIdx === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = e.clientX - rect.left;
    const svgY = e.clientY - rect.top;
    let [x, y] = fromSvgCoords(svgX, svgY, width, height);
    // 드래그 한계: 0~1로 clamp
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));
    const newCtrlPoints = ctrlPoints.map((pt, i) =>
      i === dragIdx ? { x, y } : pt
    );
    setCtrlPoints(newCtrlPoints);
    // onChange 콜백
    if (onChange) {
      onChange({
        p0: { x: 0, y: 0 },
        c0: newCtrlPoints[0],
        c1: newCtrlPoints[1],
        p1: { x: 1, y: 1 },
      });
    }
  };

  // 드래그 끝
  const handleMouseUp = () => {
    setDragIdx(null);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // 그래프 라인 샘플링
  const getLinePoints = () => {
    const samples = 64;
    const pts: [number, number][] = [];
    if (type === 'linear') {
      // y = x (0,0)-(1,1) 고정
      for (let i = 0; i <= samples; ++i) {
        const x = i / samples;
        const y = x;
        pts.push(toSvgCoords(x, y, width, height));
      }
    } else if (type === 'pow') {
      // y = pow(x, a), 시작/끝 고정
      const a = value.a;
      for (let i = 0; i <= samples; ++i) {
        const x = i / samples;
        const y = Math.pow(x, a);
        pts.push(toSvgCoords(x, y, width, height));
      }
    } else if (type === 'bezier') {
      // cubic bezier: p0(0,0), c0, c1, p1(1,1)
      const p0 = { x: 0, y: 0 };
      const c0 = ctrlPoints[0];
      const c1 = ctrlPoints[1];
      const p1 = { x: 1, y: 1 };
      // 베지어 곡선 샘플링
      function cubicBezier(t: number): [number, number] {
        const x =
          Math.pow(1 - t, 3) * p0.x +
          3 * Math.pow(1 - t, 2) * t * c0.x +
          3 * (1 - t) * Math.pow(t, 2) * c1.x +
          Math.pow(t, 3) * p1.x;
        const y =
          Math.pow(1 - t, 3) * p0.y +
          3 * Math.pow(1 - t, 2) * t * c0.y +
          3 * (1 - t) * Math.pow(t, 2) * c1.y +
          Math.pow(t, 3) * p1.y;
        return toSvgCoords(x, y, width, height) as [number, number];
      }
      for (let i = 0; i <= samples; ++i) {
        const t = i / samples;
        pts.push(cubicBezier(t));
      }
    }
    return pts;
  };

  // thumb 렌더링 (bezier 컨트롤포인트만)
  const renderThumbs = () => {
    if (type !== 'bezier') return null;
    return ctrlPoints.map((pt, i) => {
      const [cx, cy] = toSvgCoords(pt.x, pt.y, width, height);
      return (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={thumbSize / 2}
          fill="#fff"
          stroke="#333"
          strokeWidth={2}
          style={{ cursor: 'pointer' }}
          onMouseDown={(e) => handleThumbMouseDown(i, e)}
        />
      );
    });
  };

  // 축, 배경 등
  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ background: '#f8f8f8', touchAction: 'none', userSelect: 'none' }}
    >
      {/* 축 */}
      <line
        x1={PADDING}
        y1={height - PADDING}
        x2={PADDING}
        y2={PADDING}
        stroke="#aaa"
        strokeWidth={1}
      />
      <line
        x1={PADDING}
        y1={height - PADDING}
        x2={width - PADDING}
        y2={height - PADDING}
        stroke="#aaa"
        strokeWidth={1}
      />
      {/* 그래프 라인 */}
      <polyline
        fill="none"
        stroke="#007bff"
        strokeWidth={2}
        points={getLinePoints()
          .map(([x, y]) => `${x},${y}`)
          .join(' ')}
      />
      {/* thumb */}
      {renderThumbs()}
    </svg>
  );
};

export default Graph;
