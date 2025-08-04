export type Vec2 = [number, number];
export type Mat2 = [Vec2, Vec2];
export type Order = 'first' | 'middle' | 'last';

export type PointType = 'linear' | 'bezier' | 'pow';
export type PointBase = {
  type: PointType;
  point: Vec2;
};
export type PointLinear = PointBase & {
  type: 'linear';
};
export type PointPow = PointBase & {
  type: 'pow';
  exponent: number;
};
export type PointBezier = PointBase & {
  type: 'bezier';
  relativeControlPoint1: Vec2;
  relativeControlPoint2: Vec2;
};
export type Path = PointLinear | PointPow | PointBezier;
export type Paths = Path[];
