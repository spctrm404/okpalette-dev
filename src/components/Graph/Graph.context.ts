import type { Coord } from '@/models/FnPaths';
import { createContext, useContext } from 'react';

export type GraphContextValue = {
  coordToPos: (coord: Coord) => Coord;
  posToCoord: (pos: Coord) => Coord;
  clampPos: (pos: Coord) => Coord;
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
