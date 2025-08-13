import type { Vec2 } from '@/types';
import { createContext, useContext } from 'react';

export type GraphContextValue = {
  coordToPos: (coord: Vec2) => Vec2;
  posToCoord: (pos: Vec2) => Vec2;
  clampPos: (pos: Vec2) => Vec2;
};

export const GraphContext = createContext<GraphContextValue | null>(null);

export function useGraph() {
  const context = useContext(GraphContext);
  if (!context) throw new Error('useGraph must be used within a GraphProvider');
  return context;
}
