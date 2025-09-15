import { useEffect, useRef, useState } from 'react';
import type { AnyPtInstance, AnyPtObsProps } from '@/models/FnPaths';

export function usePtObsProps(point: AnyPtInstance | undefined) {
  const pointRef = useRef<AnyPtInstance | undefined>(point);
  const unsubscribeRef = useRef<() => void | undefined>(undefined);
  const [props, setProps] = useState<AnyPtObsProps | undefined>(point?.props);

  useEffect(() => {
    if (!point) return;
    if (point.id !== pointRef.current?.id) {
      unsubscribeRef.current?.();
      pointRef.current = point;
    }
    const observer = (props: AnyPtObsProps) => {
      setProps(props);
    };
    unsubscribeRef.current = point.subscribe(observer);
    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;
      pointRef.current = undefined;
      setProps(undefined);
    };
  }, [point]);

  return props;
}
