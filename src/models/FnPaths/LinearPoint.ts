import type { Vec2 } from '@/types';
import type { LinearPtObsProps } from './FnPaths.type';
import { FnPoint } from './FnPoint';

export class LinearPoint extends FnPoint<LinearPtObsProps> {
  constructor(coord: Vec2) {
    super(coord);
  }
}
