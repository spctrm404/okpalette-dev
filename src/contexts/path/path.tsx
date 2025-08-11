import { createContext, useContext } from 'react';
import { Path } from '@MODELS/Path';

// 컨텍스트 생성
export const PathContext = createContext('');

// 컨텍스트 제공
export function PathProvider({
  children,
  path,
}: {
  children: React.ReactNode;
  path: Path;
}) {
  return <PathContext.Provider value={path}>{children}</PathContext.Provider>;
}

// 컨텍스트 사용
export function usePath() {
  return useContext(PathContext);
}
