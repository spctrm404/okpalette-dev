import type { Vec2 } from '@/types';
import type { LinearPoint } from './LinearPoint';
import type { BezierPoint } from './BezierPoint';
import type { ExponentialPoint } from './ExponentialPoint';
import type { ControlPoint } from './ControlPoint';

export interface PointObsProps {
  getCoord: () => Vec2;
  getId: () => string;
}
export interface FnPtObsProps extends PointObsProps {
  getPrevPt: () => AnyFnPtInstance | undefined;
  getNextPt: () => AnyFnPtInstance | undefined;
  getRangeX: () => Vec2;
}
export interface LinearPtObsProps extends FnPtObsProps {
  getPrevPt: () => AnyFnPtInstance | undefined;
  getNextPt: () => AnyFnPtInstance | undefined;
  getRangeX: () => Vec2;
}
export interface ControlPtObsProps extends PointObsProps {
  getParentPt: () => BezierPoint;
  getNeighborPt: () => AnyFnPtInstance | undefined;
  getTwinPt: () => ControlPoint;
  isInitialized: () => boolean;
  isUsable: () => boolean;
  isActive: () => boolean;
  getAbsCoord: () => Vec2;
}
export interface BezierPtObsProps extends FnPtObsProps {
  getPrevCp: () => ControlPoint;
  getNextCp: () => ControlPoint;
}
export interface ExponentialPtObsProps extends FnPtObsProps {
  getExponent: () => number;
}

export type AnyFnPtObsProps =
  | LinearPtObsProps
  | BezierPtObsProps
  | ExponentialPtObsProps;
export type AnyPtObsProps = AnyFnPtObsProps | ControlPtObsProps;

export type AnyFnPtInstance = LinearPoint | BezierPoint | ExponentialPoint;
export type AnyPtInstance = AnyFnPtInstance | ControlPoint;

export type LinearPtArry = [number, number];
export type BezierPtArry = [number, number, number, number, number, number];
export type ExponentialPtArry = [number, number, number];
export type PathsArry = (LinearPtArry | BezierPtArry | ExponentialPtArry)[];

export type FnPoints = AnyFnPtInstance[];
export type Path = [AnyFnPtInstance, AnyFnPtInstance];

export interface FnPathsObsProps {
  isInDomain: (x: number) => boolean;
  evaluate: (x: number) => number | undefined;
}
