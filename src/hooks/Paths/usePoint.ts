import { useEffect, useReducer } from 'react';
import { Point } from '@/models/Paths';

export function usePoint(point: Point | null) {
  const [trigger, forceUpdate] = useReducer((v) => v + 1, 0);
  useEffect(() => {
    if (!point) return;
    const unsubscribe = point.subscribe(forceUpdate);
    return () => unsubscribe();
  }, [point]);
  return trigger;
}
