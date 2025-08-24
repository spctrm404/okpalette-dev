import type { Coord } from '@/models/FnPaths';
import { type GraphContextValue, GraphContext } from './Graph.context';
import { useMemo } from 'react';

type GraphProviderProps = {
  children: React.ReactNode;
  coordToPos: (coord: Coord) => Coord;
  posToCoord: (pos: Coord) => Coord;
  clampPos: (pos: Coord) => Coord;
  thumbInteractionSize: number;
  thumbDisplaySize: number;
};

export function GraphProvider({
  children,
  coordToPos,
  posToCoord,
  clampPos,
  thumbInteractionSize,
  thumbDisplaySize,
}: GraphProviderProps) {
  const contextValue = useMemo<GraphContextValue>(
    () => ({
      coordToPos,
      posToCoord,
      clampPos,
      thumbInteractionSize,
      thumbDisplaySize,
    }),
    [coordToPos, posToCoord, clampPos, thumbInteractionSize, thumbDisplaySize]
  );

  return (
    <GraphContext.Provider value={contextValue}>
      {children}
    </GraphContext.Provider>
  );
}
