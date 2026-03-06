import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextValue {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredDeviceIds: string[];
  setFilteredDeviceIds: (ids: string[]) => void;
  isSearchActive: boolean;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDeviceIds, setFilteredDeviceIds] = useState<string[]>([]);

  const isSearchActive = searchQuery.trim().length > 0;

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredDeviceIds([]);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filteredDeviceIds,
        setFilteredDeviceIds,
        isSearchActive,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
