import type { Vec2 } from '@TYPES/index';
import { SizeContext } from './context';
import { useEffect } from 'react';

type SizeProviderProps = {
  children: React.ReactNode;
  sizeStates: [Vec2, React.Dispatch<React.SetStateAction<Vec2>>];
  elemRef: React.RefObject<Element | null>;
};

export function SizeProvider({
  children,
  sizeStates,
  elemRef,
}: SizeProviderProps) {
  const [sizeState, setSizeState] = sizeStates;

  useEffect(() => {
    const elem = elemRef.current;
    if (!elem) return;
    let animationFrameId: number | null = null;
    const handleResize = () => {
      const elem = elemRef.current;
      if (!elem) return;
      const rect = elem.getBoundingClientRect();
      setSizeState((prev) => {
        if (prev[0] !== rect.width || prev[1] !== rect.height)
          return [rect.width, rect.height];
        return prev;
      });
    };
    const resizeObserver = new window.ResizeObserver(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleResize);
    });
    resizeObserver.observe(elem);
    handleResize();
    return () => {
      resizeObserver.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <SizeContext.Provider value={{ size: sizeState }}>
      {children}
    </SizeContext.Provider>
  );
}
