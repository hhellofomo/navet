import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { isSection, type Section } from '../navigation/sections';

interface NavigationState {
  currentRoom: string;
  activeSection: Section;
  setCurrentRoom: (room: string) => void;
  setActiveSection: (section: Section) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      currentRoom: 'All',
      activeSection: 'home' as Section,
      setCurrentRoom: (currentRoom) => set({ currentRoom }),
      setActiveSection: (activeSection) => set({ activeSection }),
    }),
    {
      name: 'ha-dashboard-navigation',
      storage: createJSONStorage(() => localStorage),
      // Validate and normalize persisted values before rehydrating
      merge: (persisted, current) => {
        const p = (persisted as Partial<NavigationState> | null) ?? {};
        return {
          ...current,
          currentRoom:
            typeof p.currentRoom === 'string' && p.currentRoom.length > 0 ? p.currentRoom : 'All',
          activeSection: isSection(p.activeSection) ? p.activeSection : 'home',
        };
      },
    }
  )
);
