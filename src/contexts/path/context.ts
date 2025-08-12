import { Path } from '@/models/Path';
import { createContext, useContext } from 'react';

type PathContextValue = {
  path: Path;
  renderTrigger: () => void;
};

export const PathContext = createContext<PathContextValue | null>(null);

export function usePath() {
  return useContext(PathContext);
}
