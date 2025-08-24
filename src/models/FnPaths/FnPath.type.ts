import type { Vec2 } from '@/types';
import type { LinearPoint } from './LinearPoint';
import type { BezierPoint } from './BezierPoint';
import type { ExponentialPoint } from './ExponentialPoint';
import type { ControlPoint } from './ControlPoint';

export type Coord = Vec2;
export type Range = Vec2;

export interface PointObsProps {
  coord: Coord;
  id: string;
}
export interface FnPtObsProps extends PointObsProps {
  prevPt: AnyFnPtInstance | undefined;
  nextPt: AnyFnPtInstance | undefined;
  getRangeX: () => Range;
}
export interface LinearPtObsProps extends FnPtObsProps {
  prevPt: AnyFnPtInstance | undefined;
  nextPt: AnyFnPtInstance | undefined;
  getRangeX: () => Range;
}
export interface ControlPtObsProps extends PointObsProps {
  parentPt: BezierPoint;
  neighborPt: AnyFnPtInstance | undefined;
  twinPt: ControlPoint | undefined;
  isInitialized: () => boolean;
  isUsable: () => boolean;
  isActive: () => boolean;
  getAbsCoord: () => Coord;
}
export interface BezierPtObsProps extends FnPtObsProps {
  prevCp: ControlPoint;
  nextCp: ControlPoint;
}
export interface ExponentialPtObsProps extends FnPtObsProps {
  exponent: number;
}

export type AnyFnPtObsProps =
  | LinearPtObsProps
  | BezierPtObsProps
  | ExponentialPtObsProps;
export type AnyPtObsProps = AnyFnPtObsProps | ControlPtObsProps;

export type AnyFnPtInstance = LinearPoint | BezierPoint | ExponentialPoint;
export type AnyPtInstance = AnyFnPtInstance | ControlPoint;
