export type Vec2 = [number, number];
export type Mat2 = [Vec2, Vec2];
export type Order = 'first' | 'middle' | 'last';

type PointBase = {
  order?: Order;
  vals: Vec2;
  uuid?: string;
};
type PointNextBezier = PointBase & {
  relCp2Vals: Vec2;
};
type PointNextPow = PointBase & {
  exponent: number;
};
type PointPrevBezier = PointBase & {
  relCp1Vals: Vec2;
};
type PointBothBezier = PointBase & {
  relCp1Vals: Vec2;
  relCp2Vals: Vec2;
};
type PointPrevBezierNextPow = PointBase & {
  relCp1Vals: Vec2;
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
