'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type HeaderSearchUiContextValue = {
  isSearchExpanded: boolean;
  setIsSearchExpanded: (value: boolean) => void;
  collapseSearch: () => void;
};

const HeaderSearchUiContext = createContext<HeaderSearchUiContextValue | null>(
  null,
);

export function HeaderSearchUiProvider({children}: {children: ReactNode}) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const collapseSearch = useCallback(() => setIsSearchExpanded(false), []);

  const value = useMemo(
    () => ({isSearchExpanded, setIsSearchExpanded, collapseSearch}),
    [isSearchExpanded, collapseSearch],
  );

  return (
    <HeaderSearchUiContext.Provider value={value}>
      {children}
    </HeaderSearchUiContext.Provider>
  );
}

export function useHeaderSearchUi() {
  const ctx = useContext(HeaderSearchUiContext);
  if (!ctx) {
    throw new Error('useHeaderSearchUi must be used within HeaderSearchUiProvider');
  }
  return ctx;
}
