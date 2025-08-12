import type { Vec2 } from '@TYPES/index';
import { createContext, useContext } from 'react';

type SizeContextType = {
  size: Vec2;
};

export const SizeContext = createContext<SizeContextType | null>(null);

export function useSize() {
  return useContext(SizeContext);
}
