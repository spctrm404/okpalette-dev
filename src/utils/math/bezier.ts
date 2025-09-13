import type { Vec2 } from '@/types';

function cubicBezier(
  t: number,
  p1: number,
  cp1: number,
  cp2: number,
  p2: number
): number {
  const mt = 1 - t;
  return (
    mt ** 3 * p1 + 3 * mt ** 2 * t * cp1 + 3 * mt * t ** 2 * cp2 + t ** 3 * p2
  );
}
function getTForX(
  targetX: number,
  p1x: number,
  cp1x: number,
  cp2x: number,
  p2x: number,
  epsilon = 1e-6,
  iterLimit = 50
): number {
  let tMin = 0,
    tMax = 1,
    t = 0.5 * (tMin + tMax);
  let x;
  for (let n = 0; n < iterLimit; n++) {
    t = (tMin + tMax) / 2;
    x = cubicBezier(t, p1x, cp1x, cp2x, p2x);
    if (Math.abs(x - targetX) < epsilon) return t;
    if (x < targetX) tMin = t;
    else tMax = t;
  }
  return t;
}
export function getYOnCubicBezier(
  targetX: number,
  p1: Vec2,
  cp1: Vec2,
  cp2: Vec2,
  p2: Vec2
): number {
  const t = getTForX(targetX, p1[0], cp1[0], cp2[0], p2[0]);
  return cubicBezier(t, p1[1], cp1[1], cp2[1], p2[1]);
}
