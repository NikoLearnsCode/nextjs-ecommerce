'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

type HeaderSearchUiContextValue = {
  isSearchExpanded: boolean;
  setIsSearchExpanded: (value: boolean) => void;
  collapseSearch: () => void;
  // Shared so the focus trap can scope the input + dropdown panel together.
  searchFormRef: RefObject<HTMLFormElement | null>;
};

const HeaderSearchUiContext = createContext<HeaderSearchUiContextValue | null>(
  null,
);

export function HeaderSearchUiProvider({children}: {children: ReactNode}) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const collapseSearch = useCallback(() => setIsSearchExpanded(false), []);
  const searchFormRef = useRef<HTMLFormElement>(null);

  const value = useMemo(
    () => ({isSearchExpanded, setIsSearchExpanded, collapseSearch, searchFormRef}),
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
