import { useMemo } from 'react';
import type { Mat2 } from '@/types';
import type { Coord } from '@/models/FnPaths';
import { type GraphContextValue, GraphContext } from './Graph.context';

type GraphProviderProps = {
  children: React.ReactNode;
  coordToPos: (coord: Coord) => Coord;
  posToCoord: (pos: Coord) => Coord;
  clampPos: (pos: Coord) => Coord;
  posBound: Mat2;
  thumbInteractionSize: number;
  thumbDisplaySize: number;
};

export function GraphProvider({
  children,
  coordToPos,
  posToCoord,
  clampPos,
  posBound,
  thumbInteractionSize,
  thumbDisplaySize,
}: GraphProviderProps) {
  const contextValue = useMemo<GraphContextValue>(
    () => ({
      coordToPos,
      posToCoord,
      clampPos,
      posBound,
      thumbInteractionSize,
      thumbDisplaySize,
    }),
    [
      coordToPos,
      posToCoord,
      clampPos,
      posBound,
      thumbInteractionSize,
      thumbDisplaySize,
    ]
  );

  return (
    <GraphContext.Provider value={contextValue}>
      {children}
    </GraphContext.Provider>
  );
}
