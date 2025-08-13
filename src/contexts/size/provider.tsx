import type { Vec2 } from '@/types';
import type { SizeContextValue } from './context';
import { SizeContext } from './context';
import { useEffect, useMemo } from 'react';

type SizeProviderProps = {
  children: React.ReactNode;
  observingTargetRef: React.RefObject<Element | null>;
  sizeStates: [Vec2, React.Dispatch<React.SetStateAction<Vec2>>];
};

export function SizeProvider({
  children,
  observingTargetRef,
  sizeStates,
}: SizeProviderProps) {
  const [sizeState, setSizeState] = sizeStates;

  useEffect(() => {
    const observingTarget = observingTargetRef.current;
    if (!observingTarget) return;
    let animationFrameId: number | null = null;
    const handleResize = () => {
      const elem = observingTargetRef.current;
      if (!elem) return;
      const rect = elem.getBoundingClientRect();
      setSizeState((prev) => {
        if (prev[0] !== rect.width || prev[1] !== rect.height)
          return [rect.width, rect.height];
        return prev;
      });
    };
    const resizeObserver = new ResizeObserver(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleResize);
    });
    resizeObserver.observe(observingTarget);
    handleResize();
    return () => {
      resizeObserver.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [observingTargetRef, setSizeState]);

  const contextValue = useMemo<SizeContextValue>(
    () => ({ size: sizeState }),
    [sizeState]
  );

  return (
    <SizeContext.Provider value={contextValue}>{children}</SizeContext.Provider>
  );
}
