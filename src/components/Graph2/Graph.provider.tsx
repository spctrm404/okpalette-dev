import type { Coord } from '@/models/FnPaths';
import { type GraphContextValue, GraphContext } from './Graph.context';
import { useMemo } from 'react';

type GraphProviderProps = {
  children: React.ReactNode;
  coordToPos: (coord: Coord) => Coord;
  posToCoord: (pos: Coord) => Coord;
  clampPos: (pos: Coord) => Coord;
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
