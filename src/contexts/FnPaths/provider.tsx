import { type FnPathsContextValue, FnPathsContext } from './context';

type FnPathsProviderProps = FnPathsContextValue & {
  children: React.ReactNode;
};

export function FnPathsProvider({ fnPaths, children }: FnPathsProviderProps) {
  return (
    <FnPathsContext.Provider value={{ fnPaths }}>
      {children}
    </FnPathsContext.Provider>
  );
}
