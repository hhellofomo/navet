import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SearchState {
  searchQuery: string;
  filteredDeviceIds: string[];
  setSearchQuery: (query: string) => void;
  setFilteredDeviceIds: (ids: string[]) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchQuery: '',
      filteredDeviceIds: [],
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilteredDeviceIds: (filteredDeviceIds) =>
        set((state) => {
          if (
            state.filteredDeviceIds.length === filteredDeviceIds.length &&
            state.filteredDeviceIds.every((id, index) => id === filteredDeviceIds[index])
          ) {
            return state;
          }

          return { filteredDeviceIds };
        }),
      clearSearch: () => set({ searchQuery: '', filteredDeviceIds: [] }),
    }),
    {
      name: 'ha-dashboard-search',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ searchQuery: state.searchQuery }),
    }
  )
);
