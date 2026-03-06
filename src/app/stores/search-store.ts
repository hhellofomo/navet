import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      clearSearch: () => set({ searchQuery: '' }),
    }),
    {
      name: 'ha-dashboard-search',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
