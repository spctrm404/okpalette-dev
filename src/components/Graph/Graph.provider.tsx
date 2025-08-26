import { useMemo } from 'react';
import type { Mat2 } from '@/types';
import type { Coord } from '@/models/FnPaths';
import { type GraphContextValue, GraphContext } from './Graph.context';
import type { Vec2 } from '@/utils/colour/types';

type GraphProviderProps = {
  children: React.ReactNode;
  coordToPos: (coord: Coord) => Coord;
  posToCoord: (pos: Coord) => Coord;
  clampPos: (pos: Coord) => Coord;
  paddedSize: Vec2;
  posBoundary: Mat2;
  thumbInteractionSize: number;
  thumbDisplaySize: number;
};

export function GraphProvider({
  children,
  coordToPos,
  posToCoord,
  clampPos,
  paddedSize,
  posBoundary,
  thumbInteractionSize,
  thumbDisplaySize,
}: GraphProviderProps) {
  const contextValue = useMemo<GraphContextValue>(
    () => ({
      coordToPos,
      posToCoord,
      clampPos,
      paddedSize,
      posBoundary,
      thumbInteractionSize,
      thumbDisplaySize,
    }),
    [
      coordToPos,
      posToCoord,
      clampPos,
      paddedSize,
      posBoundary,
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
