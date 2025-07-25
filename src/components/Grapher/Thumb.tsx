import React from 'react';

type Vec2 = [number, number];
type ThumbProps = {
  position: Vec2;
  color: string;
  diameter: number;
  hovered?: boolean;
  pressed?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
};

const Thumb = ({
  position,
  color,
  diameter,
  hovered,
  pressed,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
}: ThumbProps) => {
  const [x, y] = position;
  return (
    <circle
      cx={x}
      cy={y}
      r={diameter / 2}
      fill={color}
      style={{
        cursor: 'pointer',
        opacity: hovered ? 0.85 : 1,
        stroke: pressed ? '#333' : '#fff',
        strokeWidth: 3,
        transition: 'opacity 0.15s',
      }}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  );
};

export default Thumb;
