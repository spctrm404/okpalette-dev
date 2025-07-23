import React from 'react';

type ThumbProps = {
  x: number;
  y: number;
  color: string;
  radius?: number;
  hovered?: boolean;
  pressed?: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
};

const Thumb = ({
  x,
  y,
  color,
  radius = 20,
  hovered = false,
  pressed = false,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
}: ThumbProps) => (
  <circle
    cx={x}
    cy={y}
    r={radius}
    fill={color}
    style={{ cursor: 'pointer' }}
    onPointerDown={onPointerDown}
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
    data-hovered={hovered ? 'true' : undefined}
    data-pressed={pressed ? 'true' : undefined}
  />
);

export default Thumb;
