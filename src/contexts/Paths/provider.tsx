import type { PathsContextValue } from './context';
import { Paths } from '@MODELS/Paths';
import { PathsContext } from './context';
import { useCallback, useState, useMemo } from 'react';

type PathsProviderProps = {
  children: React.ReactNode;
  paths: Paths;
};

export function PathsProvider({ children, paths }: PathsProviderProps) {
  const [, setTick] = useState(0);
  const renderTrigger = useCallback(() => {
    setTick((prev) => prev + 1);
  }, []);
  const selectedPointIdStates = useState<string | null>(null);

  const contextValue = useMemo<PathsContextValue>(
    () => ({ paths, renderTrigger, selectedPointIdStates }),
    [paths, renderTrigger, selectedPointIdStates]
  );

  return (
    <PathsContext.Provider value={contextValue}>
      {children}
    </PathsContext.Provider>
  );
}
