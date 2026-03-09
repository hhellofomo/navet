import { STORAGE_KEYS } from '@/app/constants/storage-keys';
import { useDashboardEntitiesStore } from '@/app/features/dashboard';
import { useCustomCardsStore } from '@/app/features/dashboard/stores/custom-cards-store';
import { useLightPresetStore } from '@/app/features/lighting';
import { isSection } from '@/app/navigation/sections';
import { useNavigationStore } from '@/app/stores/navigation-store';
import { defaultSettings, useSettingsStore } from '@/app/stores/settings-store';
import { useThemeStore } from '@/app/stores/theme-store';
import { storage } from '@/app/utils/storage';

interface DashboardConfigPayload {
  version: 2;
  app: 'navet';
  exportedAt: string;
  theme: {
    theme: ReturnType<typeof useThemeStore.getState>['theme'];
    primaryColor: ReturnType<typeof useThemeStore.getState>['primaryColor'];
    wallpaper?: ReturnType<typeof useThemeStore.getState>['wallpaper'];
  };
  settings: Partial<
    Omit<ReturnType<typeof useSettingsStore.getState>, 'updateSettings' | 'resetSettings'>
  >;
  navigation: Pick<ReturnType<typeof useNavigationStore.getState>, 'currentRoom' | 'activeSection'>;
  customCards?: ReturnType<typeof useCustomCardsStore.getState>['cards'];
  dashboardEntities?: Pick<
    ReturnType<typeof useDashboardEntitiesStore.getState>,
    'hiddenEntityIds' | 'onboardingCompleted'
  >;
  lightPresets?: Pick<
    ReturnType<typeof useLightPresetStore.getState>,
    'globalBrightnessPresetValues' | 'globalBrightnessPresetOrder' | 'lightPresetConfigs'
  >;
  cardSizes?: Record<string, string>;
  cardOrders?: Record<string, string[]>;
  roomOrder?: string[];
}

const parseStoredJson = <T>(key: string, fallback: T): T => {
  return storage.get(key, fallback);
};

const omitUndefinedEntries = <T extends Record<string, unknown>>(value: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>;

const pruneEmptyRecord = <T extends Record<string, unknown>>(value: T): T | undefined =>
  Object.keys(value).length > 0 ? value : undefined;

const pruneEmptyArray = <T>(value: T[]): T[] | undefined => (value.length > 0 ? value : undefined);

const buildExportedSettings = (
  settingsState: Omit<
    ReturnType<typeof useSettingsStore.getState>,
    'updateSettings' | 'resetSettings'
  >
) =>
  omitUndefinedEntries({
    username:
      settingsState.username !== defaultSettings.username ? settingsState.username : undefined,
    email: settingsState.email || undefined,
    showNotifications:
      settingsState.showNotifications !== defaultSettings.showNotifications
        ? settingsState.showNotifications
        : undefined,
    showWeatherInHeader:
      settingsState.showWeatherInHeader !== defaultSettings.showWeatherInHeader
        ? settingsState.showWeatherInHeader
        : undefined,
    use24HourTime:
      settingsState.use24HourTime !== defaultSettings.use24HourTime
        ? settingsState.use24HourTime
        : undefined,
    temperatureUnit:
      settingsState.temperatureUnit !== defaultSettings.temperatureUnit
        ? settingsState.temperatureUnit
        : undefined,
    defaultView:
      settingsState.defaultView !== defaultSettings.defaultView
        ? settingsState.defaultView
        : undefined,
    compactMode:
      settingsState.compactMode !== defaultSettings.compactMode
        ? settingsState.compactMode
        : undefined,
    disableAnimations:
      settingsState.disableAnimations !== defaultSettings.disableAnimations
        ? settingsState.disableAnimations
        : undefined,
    entityInteractionMode:
      settingsState.entityInteractionMode !== defaultSettings.entityInteractionMode
        ? settingsState.entityInteractionMode
        : undefined,
  });

export const exportDashboardConfig = (): DashboardConfigPayload => {
  const themeState = useThemeStore.getState();
  const settingsState = useSettingsStore.getState();
  const navigationState = useNavigationStore.getState();
  const customCardsState = useCustomCardsStore.getState();
  const dashboardEntitiesState = useDashboardEntitiesStore.getState();
  const lightPresetState = useLightPresetStore.getState();

  return {
    version: 2,
    app: 'navet',
    exportedAt: new Date().toISOString(),
    theme: {
      theme: themeState.theme,
      primaryColor: themeState.primaryColor,
      ...(themeState.wallpaper ? { wallpaper: themeState.wallpaper } : {}),
    },
    settings: buildExportedSettings(settingsState),
    navigation: {
      currentRoom: navigationState.currentRoom,
      activeSection: navigationState.activeSection,
    },
    customCards: pruneEmptyArray(customCardsState.cards),
    dashboardEntities:
      dashboardEntitiesState.hiddenEntityIds.length > 0 ||
      dashboardEntitiesState.onboardingCompleted
        ? {
            hiddenEntityIds: dashboardEntitiesState.hiddenEntityIds,
            onboardingCompleted: dashboardEntitiesState.onboardingCompleted,
          }
        : undefined,
    lightPresets:
      Object.keys(lightPresetState.lightPresetConfigs).length > 0
        ? {
            globalBrightnessPresetValues: lightPresetState.globalBrightnessPresetValues,
            globalBrightnessPresetOrder: lightPresetState.globalBrightnessPresetOrder,
            lightPresetConfigs: lightPresetState.lightPresetConfigs,
          }
        : undefined,
    cardSizes: pruneEmptyRecord(
      parseStoredJson<Record<string, string>>(STORAGE_KEYS.cardSizes, {})
    ),
    cardOrders: pruneEmptyRecord(
      parseStoredJson<Record<string, string[]>>(STORAGE_KEYS.cardOrders, {})
    ),
    roomOrder: pruneEmptyArray(parseStoredJson<string[]>(STORAGE_KEYS.roomOrder, [])),
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const importDashboardConfig = (value: unknown) => {
  if (!isRecord(value) || (value.version !== 1 && value.version !== 2)) {
    throw new Error('Unsupported dashboard config format.');
  }

  const theme = isRecord(value.theme) ? value.theme : null;
  const settings = isRecord(value.settings) ? value.settings : null;
  const navigation = isRecord(value.navigation) ? value.navigation : null;
  const dashboardEntities = isRecord(value.dashboardEntities) ? value.dashboardEntities : {};
  const lightPresets = isRecord(value.lightPresets) ? value.lightPresets : {};

  if (!theme || !settings || !navigation) {
    throw new Error('Dashboard config file is incomplete.');
  }

  const currentThemeState = useThemeStore.getState();
  const currentLightPresetState = useLightPresetStore.getState();

  useThemeStore.setState({
    theme:
      (theme.theme as ReturnType<typeof useThemeStore.getState>['theme'] | undefined) ??
      currentThemeState.theme,
    primaryColor:
      (theme.primaryColor as
        | ReturnType<typeof useThemeStore.getState>['primaryColor']
        | undefined) ?? currentThemeState.primaryColor,
    wallpaper:
      theme.wallpaper === undefined
        ? currentThemeState.wallpaper
        : (theme.wallpaper as string | null),
  });

  useSettingsStore.setState({
    username: (settings.username as string | undefined) ?? defaultSettings.username,
    email: (settings.email as string | undefined) ?? defaultSettings.email,
    showNotifications:
      typeof settings.showNotifications === 'boolean'
        ? settings.showNotifications
        : defaultSettings.showNotifications,
    showWeatherInHeader:
      typeof settings.showWeatherInHeader === 'boolean'
        ? settings.showWeatherInHeader
        : defaultSettings.showWeatherInHeader,
    use24HourTime:
      typeof settings.use24HourTime === 'boolean'
        ? settings.use24HourTime
        : defaultSettings.use24HourTime,
    temperatureUnit:
      settings.temperatureUnit === 'celsius' || settings.temperatureUnit === 'fahrenheit'
        ? settings.temperatureUnit
        : defaultSettings.temperatureUnit,
    defaultView: (settings.defaultView as string | undefined) ?? 'all',
    compactMode:
      typeof settings.compactMode === 'boolean'
        ? settings.compactMode
        : defaultSettings.compactMode,
    disableAnimations:
      typeof settings.disableAnimations === 'boolean'
        ? settings.disableAnimations
        : defaultSettings.disableAnimations,
    entityInteractionMode:
      settings.entityInteractionMode === 'control-first' ||
      settings.entityInteractionMode === 'toggle-first'
        ? settings.entityInteractionMode
        : defaultSettings.entityInteractionMode,
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
    globalBrightnessPresetValues:
      (lightPresets.globalBrightnessPresetValues as
        | ReturnType<typeof useLightPresetStore.getState>['globalBrightnessPresetValues']
        | undefined) ?? currentLightPresetState.globalBrightnessPresetValues,
    globalBrightnessPresetOrder:
      (lightPresets.globalBrightnessPresetOrder as
        | ReturnType<typeof useLightPresetStore.getState>['globalBrightnessPresetOrder']
        | undefined) ?? currentLightPresetState.globalBrightnessPresetOrder,
    lightPresetConfigs:
      (lightPresets.lightPresetConfigs as ReturnType<
        typeof useLightPresetStore.getState
      >['lightPresetConfigs']) ?? currentLightPresetState.lightPresetConfigs,
  });

  storage.set(STORAGE_KEYS.cardSizes, isRecord(value.cardSizes) ? value.cardSizes : {});
  storage.set(STORAGE_KEYS.cardOrders, isRecord(value.cardOrders) ? value.cardOrders : {});
  storage.set(STORAGE_KEYS.roomOrder, Array.isArray(value.roomOrder) ? value.roomOrder : []);
};

export const downloadDashboardConfig = () => {
  const payload = exportDashboardConfig();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStamp = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `navet-dashboard-config-${dateStamp}.json`;
  link.click();

  URL.revokeObjectURL(url);
};

export const importDashboardConfigFromFile = async (file: File) => {
  const content = await file.text();
  const parsed = JSON.parse(content);
  importDashboardConfig(parsed);
};
