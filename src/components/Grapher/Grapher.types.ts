export type Vec2 = [number, number];
export type Mat2 = [Vec2, Vec2];
export type Order = 'first' | 'middle' | 'last';

type PointBase = {
  order?: Order;
  vals: Vec2;
  uuid?: string;
};
type PointNextBezier = PointBase & {
  relNextCpVals: Vec2;
};
type PointNextPow = PointBase & {
  exponent: number;
};
type PointPrevBezier = PointBase & {
  relPrevCpVals: Vec2;
};
type PointBothBezier = PointBase & {
  relPrevCpVals: Vec2;
  relNextCpVals: Vec2;
};
type PointPrevBezierNextPow = PointBase & {
  relPrevCpVals: Vec2;
  exponent: number;
};
export type Point =
  | PointBase
  | PointNextBezier
  | PointNextPow
  | PointPrevBezier
  | PointBothBezier
  | PointPrevBezierNextPow;
export type Path = Point[];
