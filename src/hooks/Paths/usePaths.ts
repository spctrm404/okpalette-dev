import { useEffect, useReducer } from 'react';
import { Paths } from '@/models/Paths/Paths';

export function usePaths(paths: Paths | null) {
  const [trigger, forceUpdate] = useReducer((v) => v + 1, 0);
  useEffect(() => {
    if (!paths) return;
    const unsubscribe = paths.subscribe(forceUpdate);
    return () => {
      unsubscribe();
    };
  }, [paths]);
  return trigger;
}
