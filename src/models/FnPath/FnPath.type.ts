import type { ControlPoint } from './ControlPoint';
import type { LinearPoint } from './LinearPoint';
import type { BezierPoint } from './BezierPoint';
import type { ExponentialPoint } from './ExponentialPoint';

export type Coord = [number, number];
export type Range = [number | undefined, number | undefined];

export type PointProp = {
  coord: Coord;
  rangeX: Range | undefined;
  uuid: string | undefined;
};

export type LinearPointProp = PointProp;
export type ControlPointProp = PointProp & {
  parentPt: BezierPoint;
  neighborPt: AnyPoint | undefined;
  twinPt: ControlPoint | undefined;
  isInitialized: boolean;
};
export type BezierPointProp = PointProp & {
  prevPt: AnyPoint | undefined;
  nextPt: AnyPoint | undefined;
  prevCp: ControlPoint | undefined;
  nextCp: ControlPoint | undefined;
};
export type ExponentialPointProp = PointProp & {
  exponent: number;
};

export type AnyPoint = LinearPoint | BezierPoint | ExponentialPoint;

export type Path = [AnyPoint, AnyPoint];
