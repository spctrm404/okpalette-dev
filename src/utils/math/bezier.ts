import type { Vec2 } from '@/types';

function cubicBezier(
  t: number,
  beginPt: number,
  cp1: number,
  cp2: number,
  endPt: number
): number {
  const mt = 1 - t;
  return (
    mt ** 3 * beginPt +
    3 * mt ** 2 * t * cp1 +
    3 * mt * t ** 2 * cp2 +
    t ** 3 * endPt
  );
}
function findTForX(
  targetX: number,
  beginX: number,
  cp1X: number,
  cp2X: number,
  endX: number,
  epsilon = 1e-6,
  iterLimit = 50
): number {
  let t0 = 0,
    t1 = 1,
    t = 0.5;
  let x;
  for (let n = 0; n < iterLimit; n++) {
    t = (t0 + t1) / 2;
    x = cubicBezier(t, beginX, cp1X, cp2X, endX);
    if (Math.abs(x - targetX) < epsilon) return t;
    if (x < targetX) t0 = t;
    else t1 = t;
  }
  return t;
}
export function getYOnCubicBezier(
  targetX: number,
  beginPt: Vec2,
  cp1: Vec2,
  cp2: Vec2,
  endPt: Vec2
): number {
  const t = findTForX(targetX, beginPt[0], cp1[0], cp2[0], endPt[0]);
  return cubicBezier(t, beginPt[1], cp1[1], cp2[1], endPt[1]);
}
