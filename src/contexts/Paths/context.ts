import { Paths } from '@MODELS/Paths';
import { createContext, useContext } from 'react';

export type PathsContextValue = {
  paths: Paths;
  renderTrigger: () => void;
  selectedPointIdStates: [
    string | null,
    React.Dispatch<React.SetStateAction<string | null>>
  ];
};

export const PathsContext = createContext<PathsContextValue | null>(null);

export function usePaths() {
  const context = useContext(PathsContext);
  if (!context) throw new Error('usePaths must be used within a PathsProvider');
  return context;
}
