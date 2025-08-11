import { PathContext } from './context';
import { Path } from '@MODELS/Path';

export function PathProvider({
  children,
  path,
}: {
  children: React.ReactNode;
  path: Path;
}) {
  return <PathContext.Provider value={path}>{children}</PathContext.Provider>;
}
