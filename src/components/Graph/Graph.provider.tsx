import type { Vec2 } from '@/types';
import type { GraphContextValue } from './Graph.context';
import { GraphContext } from './Graph.context';
import { useMemo } from 'react';

type GraphProviderProps = {
  children: React.ReactNode;
  coordToPos: (coord: Vec2) => Vec2;
  posToCoord: (pos: Vec2) => Vec2;
  clampPos: (pos: Vec2) => Vec2;
};

export function GraphProvider({
  children,
  coordToPos,
  posToCoord,
  clampPos,
}: GraphProviderProps) {
  const contextValue = useMemo<GraphContextValue>(
    () => ({ coordToPos, posToCoord, clampPos }),
    [coordToPos, posToCoord, clampPos]
  );

  return (
    <GraphContext.Provider value={contextValue}>
      {children}
    </GraphContext.Provider>
  );
}
