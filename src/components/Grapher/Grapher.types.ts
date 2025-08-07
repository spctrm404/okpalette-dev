export type Vec2 = [number, number];
export type Mat2 = [Vec2, Vec2];
export type Order = 'first' | 'middle' | 'last';

type PointBase = {
  order?: Order;
  val: Vec2;
  uuid?: string;
};
type PointNextBezier = PointBase & {
  nextCpRelVal: Vec2;
};
type PointPrevBezier = PointBase & {
  prevCpRelVal: Vec2;
};
type PointBothBezier = PointNextBezier & PointPrevBezier;
type PointNextPow = PointBase & {
  exponent: number;
};
type PointPrevBezierNextPow = PointPrevBezier & PointNextPow;
export type Point =
  | PointBase
  | PointNextBezier
  | PointNextPow
  | PointPrevBezier
  | PointBothBezier
  | PointPrevBezierNextPow;
export type Path = Point[];
