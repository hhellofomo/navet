import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
