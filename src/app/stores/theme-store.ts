import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'contrast';
export type PrimaryColor =
	| 'blue'
	| 'purple'
	| 'pink'
	| 'red'
	| 'orange'
	| 'yellow'
	| 'green'
	| 'teal';

interface ThemeState {
	theme: ThemeMode;
	primaryColor: PrimaryColor;
	wallpaper: string | null;
	setTheme: (theme: ThemeMode) => void;
	setPrimaryColor: (color: PrimaryColor) => void;
	setWallpaper: (wallpaper: string | null) => void;
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set) => ({
			theme: 'dark',
			primaryColor: 'orange',
			wallpaper: null,
			setTheme: (theme) => set({ theme }),
			setPrimaryColor: (primaryColor) => set({ primaryColor }),
			setWallpaper: (wallpaper) => set({ wallpaper }),
		}),
		{
			name: 'ha-dashboard-theme',
			storage: createJSONStorage(() => localStorage),
		}
	)
);
