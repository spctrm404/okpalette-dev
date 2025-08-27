import { useMemo } from 'react';
import { type GraphContextValue, GraphContext } from './Graph.context';

type GraphProviderProps = GraphContextValue & {
  children: React.ReactNode;
};

export function GraphProvider({
  children,
  observable,
  coordToPos,
  posToCoord,
  clampPos,
  padding,
  paddedSize,
  posBound,
  thumbInteractionSize,
  thumbDisplaySize,
}: GraphProviderProps) {
  const contextValue = useMemo<GraphContextValue>(
    () => ({
      observable,
      coordToPos,
      posToCoord,
      clampPos,
      padding,
      paddedSize,
      posBound,
      thumbInteractionSize,
      thumbDisplaySize,
    }),
    [
      observable,
      coordToPos,
      posToCoord,
      clampPos,
      padding,
      paddedSize,
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
