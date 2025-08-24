import { createContext, useContext } from 'react';
import type { Mat2 } from '@/types/math';
import type { Coord } from '@/models/FnPaths';

export type GraphContextValue = {
  coordToPos: (coord: Coord) => Coord;
  posToCoord: (pos: Coord) => Coord;
  clampPos: (pos: Coord) => Coord;
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
