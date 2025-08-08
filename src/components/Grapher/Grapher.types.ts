export type Vec2 = [number, number];
export type Mat2 = [Vec2, Vec2];
export type Order = 'first' | 'middle' | 'last';

type PointBase = {
  order?: Order;
  val: Vec2;
  uuid?: string;
};
export type PointNextBezier = PointBase & {
  nextCpRelVal: Vec2;
};
export type PointPrevBezier = PointBase & {
  prevCpRelVal: Vec2;
};
export type PointBothBezier = PointNextBezier & PointPrevBezier;
export type PointNextPow = PointBase & {
  exponent: number;
};
export type PointPrevBezierNextPow = PointPrevBezier & PointNextPow;
export type Point =
  | PointBase
  | PointNextBezier
  | PointNextPow
  | PointPrevBezier
  | PointBothBezier
  | PointPrevBezierNextPow;
export type Path = Point[];
