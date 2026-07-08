import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Section } from '../contexts/navigation-context';

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
      activeSection: 'home',
      setCurrentRoom: (currentRoom) => set({ currentRoom }),
      setActiveSection: (activeSection) => set({ activeSection }),
    }),
    {
      name: 'ha-dashboard-navigation',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
