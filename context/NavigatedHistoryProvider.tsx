'use client';

import {createContext, useContext, useState, ReactNode} from 'react';

type NavigatedProduct = {
  slug: string;
  image: string;
  name: string;
};

type NavigatedHistoryContextType = {
  navigatedProducts: NavigatedProduct[];
  handleSaveNavigated: (product: {
    slug: string;
    image: string;
    name: string;
  }) => void;
  searchHistory: string[];
  handleSaveSearch: (searchTerm: string) => void;
  handleRemoveAllSearches: () => void;
};

const NavigatedHistoryContext = createContext<
  NavigatedHistoryContextType | undefined
>(undefined);

function loadFromSession<T>(key: string, fallback: T): T {
  // sessionStorage doesn't exist during SSR
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(
      `Failed to parse "${key}" from sessionStorage on initial load`,
      error,
    );
    return fallback;
  }
}

export const NavigatedHistoryProvider = ({children}: {children: ReactNode}) => {
  const [navigatedProducts, setNavigatedProducts] = useState(() =>
    loadFromSession<NavigatedProduct[]>('navigated', []),
  );
  const [searchHistory, setSearchHistory] = useState(() =>
    loadFromSession<string[]>('searchHistory', []),
  );

  // Using in ProductCard.tsx - saves clicked product to navigated history
  const handleSaveNavigated = (product: {
    slug: string;
    image: string;
    name: string;
  }) => {
    setNavigatedProducts((prevNavigatedProducts) => {
      const newNavigatedList = [
        product,
        ...prevNavigatedProducts.filter((p) => p.slug !== product.slug),
      ].slice(0, 9);
      try {
        sessionStorage.setItem('navigated', JSON.stringify(newNavigatedList));
      } catch (error) {
        console.error(
          'Failed to save navigated items to sessionStorage',
          error
        );
      }
      return newNavigatedList;
    });
  };

  // Using in SearchDropdown.tsx - saves search term to search history
  const handleSaveSearch = (searchTerm: string) => {
    setSearchHistory((prevSearchHistory) => {
      const newSearchHistory = [
        searchTerm,
        ...prevSearchHistory.filter((s) => s !== searchTerm),
      ].slice(0, 7);
      try {
        sessionStorage.setItem(
          'searchHistory',
          JSON.stringify(newSearchHistory)
        );
      } catch (error) {
        console.error('Failed to save search history to sessionStorage', error);
      }
      return newSearchHistory;
    });
  };

  // Using in SearchDropdown.tsx - deletes all search history
  const handleRemoveAllSearches = () => {
    setSearchHistory(() => {
      const newSearchHistory: string[] = [];
      try {
        sessionStorage.setItem(
          'searchHistory',
          JSON.stringify(newSearchHistory)
        );
      } catch (error) {
        console.error(
          'Failed to remove search term from sessionStorage',
          error
        );
      }
      return newSearchHistory;
    });
  };

  return (
    <NavigatedHistoryContext.Provider
      value={{
        navigatedProducts,
        handleSaveNavigated,
        searchHistory,
        handleSaveSearch,
        handleRemoveAllSearches,
      }}
    >
      {children}
    </NavigatedHistoryContext.Provider>
  );
};

export const useNavigatedHistory = () => {
  const context = useContext(NavigatedHistoryContext);
  if (context === undefined) {
    throw new Error(
      'useNavigatedHistory must be used within a NavigatedHistoryProvider'
    );
  }
  return context;
};
