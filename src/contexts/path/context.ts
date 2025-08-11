import { createContext, useContext } from 'react';
import { Path } from '@MODELS/Path';

export const PathContext = createContext<Path>(new Path());

export function usePath() {
  return useContext(PathContext);
}
