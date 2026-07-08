/**
 * Optimized selectors for Zustand stores
 * Use these to prevent unnecessary re-renders
 */

import type {
  CustomCardsState,
  EditModeState,
  NavigationState,
  SearchState,
  SettingsState,
  ThemeState,
} from './types';

/**
 * Theme Store Selectors
 * Use these to subscribe only to specific values
 */
export const themeSelectors = {
  // Single value selectors
  theme: (state: ThemeState) => state.theme,
  primaryColor: (state: ThemeState) => state.primaryColor,
  wallpaper: (state: ThemeState) => state.wallpaper,

  // Action selectors (never cause re-renders)
  setTheme: (state: ThemeState) => state.setTheme,
  setPrimaryColor: (state: ThemeState) => state.setPrimaryColor,
  setWallpaper: (state: ThemeState) => state.setWallpaper,

  // Combined selectors (use with shallow equality)
  themeAndColor: (state: ThemeState) => ({
    theme: state.theme,
    primaryColor: state.primaryColor,
  }),
  allValues: (state: ThemeState) => ({
    theme: state.theme,
    primaryColor: state.primaryColor,
    wallpaper: state.wallpaper,
  }),
  allActions: (state: ThemeState) => ({
    setTheme: state.setTheme,
    setPrimaryColor: state.setPrimaryColor,
    setWallpaper: state.setWallpaper,
  }),
};

/**
 * Edit Mode Store Selectors
 */
export const editModeSelectors = {
  isEditMode: (state: EditModeState) => state.isEditMode,
  setEditMode: (state: EditModeState) => state.setEditMode,
  toggleEditMode: (state: EditModeState) => state.toggleEditMode,
};

/**
 * Navigation Store Selectors
 */
export const navigationSelectors = {
  currentRoom: (state: NavigationState) => state.currentRoom,
  setCurrentRoom: (state: NavigationState) => state.setCurrentRoom,
  activeSection: (state: NavigationState) => state.activeSection,
  setActiveSection: (state: NavigationState) => state.setActiveSection,
};

/**
 * Search Store Selectors
 */
export const searchSelectors = {
  searchQuery: (state: SearchState) => state.searchQuery,
  filteredDeviceIds: (state: SearchState) => state.filteredDeviceIds,
  setSearchQuery: (state: SearchState) => state.setSearchQuery,
  setFilteredDeviceIds: (state: SearchState) => state.setFilteredDeviceIds,
  clearSearch: (state: SearchState) => state.clearSearch,

  // Computed selectors
  isSearching: (state: SearchState) => state.searchQuery.length > 0,
};

/**
 * Settings Store Selectors
 */
export const settingsSelectors = {
  // Individual settings
  username: (state: SettingsState) => state.username,
  email: (state: SettingsState) => state.email,
  language: (state: SettingsState) => state.language,
  showNotifications: (state: SettingsState) => state.showNotifications,
  showWeatherInHeader: (state: SettingsState) => state.showWeatherInHeader,
  use24HourTime: (state: SettingsState) => state.use24HourTime,
  temperatureUnit: (state: SettingsState) => state.temperatureUnit,
  defaultView: (state: SettingsState) => state.defaultView,
  compactMode: (state: SettingsState) => state.compactMode,
  disableAnimations: (state: SettingsState) => state.disableAnimations,
  lowPowerMode: (state: SettingsState) => state.lowPowerMode,
  entityInteractionMode: (state: SettingsState) => state.entityInteractionMode,
  ambientLightBleed: (state: SettingsState) => state.ambientLightBleed,

  // Actions
  updateSettings: (state: SettingsState) => state.updateSettings,
  resetSettings: (state: SettingsState) => state.resetSettings,

  // Combined selectors
  displaySettings: (state: SettingsState) => ({
    language: state.language,
    use24HourTime: state.use24HourTime,
    temperatureUnit: state.temperatureUnit,
    compactMode: state.compactMode,
    disableAnimations: state.disableAnimations,
    lowPowerMode: state.lowPowerMode,
    entityInteractionMode: state.entityInteractionMode,
    ambientLightBleed: state.ambientLightBleed,
  }),
  notificationSettings: (state: SettingsState) => ({
    showNotifications: state.showNotifications,
    showWeatherInHeader: state.showWeatherInHeader,
  }),
};

/**
 * Custom Cards Store Selectors
 */
export const customCardsSelectors = {
  cards: (state: CustomCardsState) => state.cards,
  addCard: (state: CustomCardsState) => state.addCard,
  removeCard: (state: CustomCardsState) => state.removeCard,
  updateCard: (state: CustomCardsState) => state.updateCard,
  getCardsForRoom: (state: CustomCardsState) => state.getCardsForRoom,

  // Computed selectors
  cardsCount: (state: CustomCardsState) => state.cards.length,
  hasCards: (state: CustomCardsState) => state.cards.length > 0,
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
