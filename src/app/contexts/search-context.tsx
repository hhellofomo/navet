import { createContext, type ReactNode, useContext, useState } from 'react';
import { useSearchStore } from '../stores/search-store';
import { searchSelectors } from '../stores/selectors';

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
	// Use the search store for search query management
	const searchQuery = useSearchStore(searchSelectors.searchQuery);
	const setSearchQuery = useSearchStore(searchSelectors.setSearchQuery);
	const clearSearchAction = useSearchStore(searchSelectors.clearSearch);

	// Local state for filtered device IDs (this is UI-specific state)
	const [filteredDeviceIds, setFilteredDeviceIds] = useState<string[]>([]);

	const isSearchActive = searchQuery.trim().length > 0;

	const clearSearch = () => {
		clearSearchAction();
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
