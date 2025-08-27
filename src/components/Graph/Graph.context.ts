import { createContext, useContext } from 'react';
import type { Mat2, Vec2 } from '@/types';
import type { Observable } from '@/models/Observable';
import type { ObsProps } from './Graph';

export type GraphContextValue = {
  observable: Observable<ObsProps>;
  coordToPos: (coord: Vec2) => Vec2;
  posToCoord: (pos: Vec2) => Vec2;
  clampPos: (pos: Vec2) => Vec2;
  padding: number;
  paddedSize: Vec2;
  posBound: Mat2;
  thumbInteractionSize: number;
  thumbDisplaySize: number;
};

export const GraphContext = createContext<GraphContextValue | undefined>(
  undefined
);

export function useGraph() {
  const context = useContext(GraphContext);
  if (!context) throw new Error('useGraph must be used within a GraphProvider');
  return context;
}
