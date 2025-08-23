import type { LinearPoint } from './LinearPoint';
import type { BezierPoint } from './BezierPoint';
import type { ExponentialPoint } from './ExponentialPoint';
import type { ControlPoint } from './ControlPoint';

export type Coord = [number, number];
export type Range = [number | undefined, number | undefined];

export interface PointObsProps {
  coord: Coord;
  id: string;
}
export interface FnPtObsProps extends PointObsProps {
  prevPt: AnyPoint | undefined;
  nextPt: AnyPoint | undefined;
  rangeX: () => Range;
}
export type LinearPtObsProps = FnPtObsProps;
export interface ControlPtObsProps extends PointObsProps {
  parentPt: BezierPoint;
  neighborPt: AnyPoint | undefined;
  twinPt: ControlPoint | undefined;
  isInitialized: () => boolean;
  isUsable: () => boolean;
  isActive: () => boolean;
  absCoord: () => Coord;
}
export interface BezierPtObsProps extends FnPtObsProps {
  prevCp: ControlPoint;
  nextCp: ControlPoint;
}
export interface ExponentialPtObsProps extends FnPtObsProps {
  exponent: number;
}

export type AnyPoint = LinearPoint | BezierPoint | ExponentialPoint;

// export type AnyPoint =
//   | LinearPtObsProps
//   | BezierPtObsProps
//   | ExponentialPtObsProps;
