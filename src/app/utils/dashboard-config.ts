import { STORAGE_KEYS } from '../constants/storage-keys';
import { isSection } from '../navigation/sections';
import { useCustomCardsStore } from '../stores/custom-cards-store';
import { useDashboardEntitiesStore } from '../stores/dashboard-entities-store';
import { useLightPresetStore } from '../stores/light-preset-store';
import { useNavigationStore } from '../stores/navigation-store';
import { useSettingsStore } from '../stores/settings-store';
import { useThemeStore } from '../stores/theme-store';
import { storage } from './storage';

interface DashboardConfigPayload {
  version: 1;
  exportedAt: string;
  theme: {
    theme: ReturnType<typeof useThemeStore.getState>['theme'];
    primaryColor: ReturnType<typeof useThemeStore.getState>['primaryColor'];
    wallpaper: ReturnType<typeof useThemeStore.getState>['wallpaper'];
  };
  settings: Omit<ReturnType<typeof useSettingsStore.getState>, 'updateSettings' | 'resetSettings'>;
  navigation: Pick<ReturnType<typeof useNavigationStore.getState>, 'currentRoom' | 'activeSection'>;
  customCards: ReturnType<typeof useCustomCardsStore.getState>['cards'];
  dashboardEntities: Pick<
    ReturnType<typeof useDashboardEntitiesStore.getState>,
    'hiddenEntityIds' | 'onboardingCompleted'
  >;
  lightPresets: Pick<
    ReturnType<typeof useLightPresetStore.getState>,
    'globalBrightnessPresetValues' | 'globalBrightnessPresetOrder' | 'lightPresetConfigs'
  >;
  cardSizes: Record<string, string>;
  cardOrders: Record<string, string[]>;
  roomOrder: string[];
}

const parseStoredJson = <T>(key: string, fallback: T): T => {
  return storage.get(key, fallback);
};

export const exportDashboardConfig = (): DashboardConfigPayload => {
  const themeState = useThemeStore.getState();
  const settingsState = useSettingsStore.getState();
  const navigationState = useNavigationStore.getState();
  const customCardsState = useCustomCardsStore.getState();
  const dashboardEntitiesState = useDashboardEntitiesStore.getState();
  const lightPresetState = useLightPresetStore.getState();

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    theme: {
      theme: themeState.theme,
      primaryColor: themeState.primaryColor,
      wallpaper: themeState.wallpaper,
    },
    settings: {
      username: settingsState.username,
      email: settingsState.email,
      showNotifications: settingsState.showNotifications,
      showWeatherInHeader: settingsState.showWeatherInHeader,
      use24HourTime: settingsState.use24HourTime,
      temperatureUnit: settingsState.temperatureUnit,
      defaultView: settingsState.defaultView,
      compactMode: settingsState.compactMode,
      disableAnimations: settingsState.disableAnimations,
      entityInteractionMode: settingsState.entityInteractionMode,
    },
    navigation: {
      currentRoom: navigationState.currentRoom,
      activeSection: navigationState.activeSection,
    },
    customCards: customCardsState.cards,
    dashboardEntities: {
      hiddenEntityIds: dashboardEntitiesState.hiddenEntityIds,
      onboardingCompleted: dashboardEntitiesState.onboardingCompleted,
    },
    lightPresets: {
      globalBrightnessPresetValues: lightPresetState.globalBrightnessPresetValues,
      globalBrightnessPresetOrder: lightPresetState.globalBrightnessPresetOrder,
      lightPresetConfigs: lightPresetState.lightPresetConfigs,
    },
    cardSizes: parseStoredJson<Record<string, string>>(STORAGE_KEYS.cardSizes, {}),
    cardOrders: parseStoredJson<Record<string, string[]>>(STORAGE_KEYS.cardOrders, {}),
    roomOrder: parseStoredJson<string[]>(STORAGE_KEYS.roomOrder, []),
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const importDashboardConfig = (value: unknown) => {
  if (!isRecord(value) || value.version !== 1) {
    throw new Error('Unsupported dashboard config format.');
  }

  const theme = isRecord(value.theme) ? value.theme : null;
  const settings = isRecord(value.settings) ? value.settings : null;
  const navigation = isRecord(value.navigation) ? value.navigation : null;
  const dashboardEntities = isRecord(value.dashboardEntities) ? value.dashboardEntities : null;
  const lightPresets = isRecord(value.lightPresets) ? value.lightPresets : null;

  if (!theme || !settings || !navigation || !dashboardEntities || !lightPresets) {
    throw new Error('Dashboard config file is incomplete.');
  }

  useThemeStore.setState({
    theme: theme.theme as ReturnType<typeof useThemeStore.getState>['theme'],
    primaryColor: theme.primaryColor as ReturnType<typeof useThemeStore.getState>['primaryColor'],
    wallpaper: (theme.wallpaper as string | null | undefined) ?? null,
  });

  useSettingsStore.setState({
    username: (settings.username as string | undefined) ?? 'User',
    email: (settings.email as string | undefined) ?? '',
    showNotifications: Boolean(settings.showNotifications),
    showWeatherInHeader: Boolean(settings.showWeatherInHeader),
    use24HourTime: Boolean(settings.use24HourTime),
    temperatureUnit: settings.temperatureUnit === 'celsius' ? 'celsius' : 'fahrenheit',
    defaultView: (settings.defaultView as string | undefined) ?? 'all',
    compactMode: Boolean(settings.compactMode),
    disableAnimations: Boolean(settings.disableAnimations),
    entityInteractionMode:
      settings.entityInteractionMode === 'control-first' ? 'control-first' : 'toggle-first',
  });

  useNavigationStore.setState({
    currentRoom: (navigation.currentRoom as string | undefined) ?? 'All',
    activeSection: isSection(navigation.activeSection) ? navigation.activeSection : 'home',
  });

  useCustomCardsStore.setState({
    cards: Array.isArray(value.customCards) ? value.customCards : [],
  });

  useDashboardEntitiesStore.setState({
    hiddenEntityIds: Array.isArray(dashboardEntities.hiddenEntityIds)
      ? dashboardEntities.hiddenEntityIds.filter((item): item is string => typeof item === 'string')
      : [],
    onboardingCompleted:
      typeof dashboardEntities.onboardingCompleted === 'boolean'
        ? dashboardEntities.onboardingCompleted
        : true,
  });

  useLightPresetStore.setState({
    globalBrightnessPresetValues: lightPresets.globalBrightnessPresetValues as ReturnType<
      typeof useLightPresetStore.getState
    >['globalBrightnessPresetValues'],
    globalBrightnessPresetOrder: lightPresets.globalBrightnessPresetOrder as ReturnType<
      typeof useLightPresetStore.getState
    >['globalBrightnessPresetOrder'],
    lightPresetConfigs:
      (lightPresets.lightPresetConfigs as ReturnType<
        typeof useLightPresetStore.getState
      >['lightPresetConfigs']) ?? {},
  });

  storage.set(STORAGE_KEYS.cardSizes, isRecord(value.cardSizes) ? value.cardSizes : {});
  storage.set(STORAGE_KEYS.cardOrders, isRecord(value.cardOrders) ? value.cardOrders : {});
  storage.set(STORAGE_KEYS.roomOrder, Array.isArray(value.roomOrder) ? value.roomOrder : []);
};
