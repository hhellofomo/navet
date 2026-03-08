import { useCustomCardsStore } from '../stores/custom-cards-store';
import { useDashboardEntitiesStore } from '../stores/dashboard-entities-store';
import { useLightPresetStore } from '../stores/light-preset-store';
import { useNavigationStore } from '../stores/navigation-store';
import { useSettingsStore } from '../stores/settings-store';
import { useThemeStore } from '../stores/theme-store';

const CARD_SIZES_STORAGE_KEY = 'ha-dashboard-card-sizes';
const CARD_ORDERS_STORAGE_KEY = 'ha-dashboard-card-orders';
const ROOM_ORDER_STORAGE_KEY = 'ha-dashboard-room-order';

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
    'mode' | 'manualEntityIds'
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
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
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
      mode: dashboardEntitiesState.mode,
      manualEntityIds: dashboardEntitiesState.manualEntityIds,
    },
    lightPresets: {
      globalBrightnessPresetValues: lightPresetState.globalBrightnessPresetValues,
      globalBrightnessPresetOrder: lightPresetState.globalBrightnessPresetOrder,
      lightPresetConfigs: lightPresetState.lightPresetConfigs,
    },
    cardSizes: parseStoredJson<Record<string, string>>(CARD_SIZES_STORAGE_KEY, {}),
    cardOrders: parseStoredJson<Record<string, string[]>>(CARD_ORDERS_STORAGE_KEY, {}),
    roomOrder: parseStoredJson<string[]>(ROOM_ORDER_STORAGE_KEY, []),
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
    activeSection: (navigation.activeSection as 'home' | undefined) ?? 'home',
  });

  useCustomCardsStore.setState({
    cards: Array.isArray(value.customCards) ? value.customCards : [],
  });

  useDashboardEntitiesStore.setState({
    mode: dashboardEntities.mode === 'manual' ? 'manual' : 'auto',
    manualEntityIds: Array.isArray(dashboardEntities.manualEntityIds)
      ? dashboardEntities.manualEntityIds.filter((item): item is string => typeof item === 'string')
      : [],
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

  localStorage.setItem(
    CARD_SIZES_STORAGE_KEY,
    JSON.stringify(isRecord(value.cardSizes) ? value.cardSizes : {})
  );
  localStorage.setItem(
    CARD_ORDERS_STORAGE_KEY,
    JSON.stringify(isRecord(value.cardOrders) ? value.cardOrders : {})
  );
  localStorage.setItem(
    ROOM_ORDER_STORAGE_KEY,
    JSON.stringify(Array.isArray(value.roomOrder) ? value.roomOrder : [])
  );
};
