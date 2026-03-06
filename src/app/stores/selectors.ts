/**
 * Optimized selectors for Zustand stores
 * Use these to prevent unnecessary re-renders
 */

import type { 
  ThemeMode, 
  PrimaryColor 
} from './theme-store';

/**
 * Theme Store Selectors
 * Use these to subscribe only to specific values
 */
export const themeSelectors = {
  // Single value selectors
  theme: (state: any) => state.theme as ThemeMode,
  primaryColor: (state: any) => state.primaryColor as PrimaryColor,
  wallpaper: (state: any) => state.wallpaper as string | null,
  
  // Action selectors (never cause re-renders)
  setTheme: (state: any) => state.setTheme,
  setPrimaryColor: (state: any) => state.setPrimaryColor,
  setWallpaper: (state: any) => state.setWallpaper,
  
  // Combined selectors (use with shallow equality)
  themeAndColor: (state: any) => ({
    theme: state.theme,
    primaryColor: state.primaryColor,
  }),
  
  allActions: (state: any) => ({
    setTheme: state.setTheme,
    setPrimaryColor: state.setPrimaryColor,
    setWallpaper: state.setWallpaper,
  }),
};

/**
 * Edit Mode Store Selectors
 */
export const editModeSelectors = {
  isEditMode: (state: any) => state.isEditMode as boolean,
  setEditMode: (state: any) => state.setEditMode,
  toggleEditMode: (state: any) => state.toggleEditMode,
};

/**
 * Navigation Store Selectors
 */
export const navigationSelectors = {
  currentRoom: (state: any) => state.currentRoom as string,
  setCurrentRoom: (state: any) => state.setCurrentRoom,
};

/**
 * Search Store Selectors
 */
export const searchSelectors = {
  searchQuery: (state: any) => state.searchQuery as string,
  setSearchQuery: (state: any) => state.setSearchQuery,
  clearSearch: (state: any) => state.clearSearch,
  
  // Computed selectors
  isSearching: (state: any) => (state.searchQuery as string).length > 0,
};

/**
 * Settings Store Selectors
 */
export const settingsSelectors = {
  // Individual settings
  username: (state: any) => state.username as string,
  email: (state: any) => state.email as string,
  showNotifications: (state: any) => state.showNotifications as boolean,
  showWeatherInHeader: (state: any) => state.showWeatherInHeader as boolean,
  use24HourTime: (state: any) => state.use24HourTime as boolean,
  temperatureUnit: (state: any) => state.temperatureUnit as 'celsius' | 'fahrenheit',
  defaultView: (state: any) => state.defaultView as string,
  compactMode: (state: any) => state.compactMode as boolean,
  
  // Actions
  updateSettings: (state: any) => state.updateSettings,
  resetSettings: (state: any) => state.resetSettings,
  
  // Combined selectors
  displaySettings: (state: any) => ({
    use24HourTime: state.use24HourTime,
    temperatureUnit: state.temperatureUnit,
    compactMode: state.compactMode,
  }),
  
  notificationSettings: (state: any) => ({
    showNotifications: state.showNotifications,
    showWeatherInHeader: state.showWeatherInHeader,
  }),
};

/**
 * Custom Cards Store Selectors
 */
export const customCardsSelectors = {
  cards: (state: any) => state.cards,
  addCard: (state: any) => state.addCard,
  removeCard: (state: any) => state.removeCard,
  updateCard: (state: any) => state.updateCard,
  getCardsForRoom: (state: any) => state.getCardsForRoom,
  
  // Computed selectors
  cardsCount: (state: any) => state.cards.length,
  hasCards: (state: any) => state.cards.length > 0,
};

/**
 * Example usage:
 * 
 * // ✅ Optimized - only re-renders when theme changes
 * const theme = useThemeStore(themeSelectors.theme);
 * 
 * // ✅ Actions only - never causes re-renders
 * const setTheme = useThemeStore(themeSelectors.setTheme);
 * 
 * // ✅ Multiple values with shallow equality
 * import { shallow } from 'zustand/shallow';
 * const { theme, primaryColor } = useThemeStore(
 *   themeSelectors.themeAndColor,
 *   shallow
 * );
 */
