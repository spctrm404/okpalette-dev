import { createContext, useContext } from 'react';
import { FnPaths } from '@/models/FnPaths';

export type FnPathsContextValue = {
  fnPaths: FnPaths;
};

export const FnPathsContext = createContext<FnPathsContextValue | undefined>(
  undefined
);

export function useFnPathsContext(): FnPathsContextValue {
  const context = useContext(FnPathsContext);
  if (!context) {
    throw new Error('useFnPathsContext must be used within a FnPathsProvider');
  }
  return context;
}
