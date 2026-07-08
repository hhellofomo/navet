import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { type AppLanguage, getNavigatorLanguage } from '@/app/i18n/config';

export type EntityInteractionMode = 'control-first' | 'toggle-first';

export interface UserSettings {
  username: string;
  email: string;
  language: AppLanguage;
  showNotifications: boolean;
  showWeatherInHeader: boolean;
  use24HourTime: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
  defaultView: 'all' | string;
  compactMode: boolean;
  disableAnimations: boolean;
  entityInteractionMode: EntityInteractionMode;
  ambientLightBleed: boolean;
}

interface SettingsState extends UserSettings {
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

export const defaultSettings: UserSettings = {
  username: 'User',
  email: '',
  language: getNavigatorLanguage(),
  showNotifications: true,
  showWeatherInHeader: true,
  use24HourTime: false,
  temperatureUnit: 'fahrenheit',
  defaultView: 'all',
  compactMode: false,
  disableAnimations: false,
  entityInteractionMode: 'toggle-first',
  ambientLightBleed: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'ha-dashboard-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
