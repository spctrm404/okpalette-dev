import { useEffect, useRef, useState } from 'react';
import type { AnyPtInstance, AnyPtObsProps } from '@/models/FnPaths';

export function usePoint(point: AnyPtInstance | undefined) {
  const pointRef = useRef<AnyPtInstance | undefined>(point);
  const unsubscribeRef = useRef<() => void | undefined>(undefined);
  const [pointObservableState, setPointObservableState] = useState<
    AnyPtObsProps | undefined
  >(point?.props);

  useEffect(() => {
    if (!point) return;
    if (point.id !== pointRef.current?.id) {
      unsubscribeRef.current?.();
      pointRef.current = point;
    }
    const observer = {
      update: () => setPointObservableState(point.props),
    };
    unsubscribeRef.current = point.subscribe(observer);
    return () => {
      unsubscribeRef.current?.();
    };
  }, [point]);

  return pointObservableState;
}
