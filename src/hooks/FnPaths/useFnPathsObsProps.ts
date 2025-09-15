import { useEffect, useRef, useState } from 'react';
import type { FnPaths, FnPathsObsProps } from '@/models/FnPaths';

export function useFnPathsObsProps(paths: FnPaths | undefined) {
  const pathsRef = useRef<FnPaths | undefined>(paths);
  const unsubscribeRef = useRef<() => void | undefined>(undefined);
  const [props, setProps] = useState<FnPathsObsProps | undefined>(paths?.props);

  useEffect(() => {
    if (!paths) return;
    if (paths !== pathsRef.current) {
      unsubscribeRef.current?.();
      pathsRef.current = paths;
    }
    const observer = (props: FnPathsObsProps) => {
      setProps(props);
    };
    unsubscribeRef.current = paths.subscribe(observer);
    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;
      pathsRef.current = undefined;
      setProps(undefined);
    };
  }, [paths]);

  return props;
}
