import type { Vec2 } from '@/types';
import { createContext, useContext } from 'react';

export type SizeContextValue = {
  size: Vec2;
};

export const SizeContext = createContext<SizeContextValue | null>(null);

export function useSize() {
  const context = useContext(SizeContext);
  if (!context) throw new Error('useSize must be used within a SizeProvider');
  return context;
}
