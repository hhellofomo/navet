import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface NavigationState {
	currentRoom: string;
	setCurrentRoom: (room: string) => void;
}

export const useNavigationStore = create<NavigationState>()(
	persist(
		(set) => ({
			currentRoom: 'all',
			setCurrentRoom: (currentRoom) => set({ currentRoom }),
		}),
		{
			name: 'ha-dashboard-navigation',
			storage: createJSONStorage(() => localStorage),
		}
	)
);
