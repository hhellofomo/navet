import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'contrast' | 'glass';
export type PrimaryColor =
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'custom';

interface ThemeState {
  theme: ThemeMode;
  followSystemTheme: boolean;
  primaryColor: PrimaryColor;
  customPrimaryColor: string | null;
  wallpaper: string | null;
  setTheme: (theme: ThemeMode) => void;
  setFollowSystemTheme: (follow: boolean) => void;
  setPrimaryColor: (color: PrimaryColor) => void;
  setCustomPrimaryColor: (color: string | null) => void;
  setWallpaper: (wallpaper: string | null) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      followSystemTheme: false,
      primaryColor: 'orange',
      customPrimaryColor: null,
      wallpaper: null,
      setTheme: (theme) => set({ theme }),
      setFollowSystemTheme: (followSystemTheme) => set({ followSystemTheme }),
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      setCustomPrimaryColor: (customPrimaryColor) => set({ customPrimaryColor }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
    }),
    {
      name: 'ha-dashboard-theme',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
