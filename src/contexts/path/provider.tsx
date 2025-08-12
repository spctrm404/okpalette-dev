import { Path } from '@/models/Path';
import { PathContext } from './context';
import { useCallback, useRef, useState, useMemo } from 'react';

type PathProviderProps = {
  children: React.ReactNode;
  pathArray: number[][];
};

export function PathProvider({ children, pathArray }: PathProviderProps) {
  const pathRef = useRef<Path>(Path.fromArray(pathArray));
  const [, setTick] = useState(0);
  const renderTrigger = useCallback(() => {
    setTick((prev) => prev + 1);
  }, []);

  const contextValue = useMemo(
    () => ({ path: pathRef.current, renderTrigger }),
    [renderTrigger]
  );

  return (
    <PathContext.Provider value={contextValue}>{children}</PathContext.Provider>
  );
}
