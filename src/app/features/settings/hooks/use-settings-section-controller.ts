import { type ChangeEvent, useRef, useState } from 'react';
import { toast } from 'sonner';
import { PRIMARY_COLOR_OPTIONS, THEME_OPTIONS } from '@/app/constants/theme-options';
import { useAuth } from '@/app/contexts/auth-context';
import { useConfig } from '@/app/contexts/config-context';
import { useDashboardEntitiesStore } from '@/app/features/dashboard';
import { useI18n, useTheme } from '@/app/hooks';
import { type EntityInteractionMode, useSettingsStore } from '@/app/stores';
import { useNavigationStore } from '@/app/stores/navigation-store';
import { useThemeStore } from '@/app/stores/theme-store';
import {
  downloadDashboardConfig,
  importDashboardConfigFromFile,
} from '@/app/utils/dashboard-config';
import { readFileAsDataUrl, validateImageFile } from '@/app/utils/image-upload';
import { getSettingsSectionStyles } from './settings-section-styles';

export type SectionNavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type SettingsSectionStyles = {
  accentColor: string;
  borderColor: string;
  cardBg: string;
  chipBg: string;
  chipHoverBg: string;
  chipTextColor: string;
  dividerColor: string;
  elevatedShadow: string;
  floatingButtonBg: string;
  floatingButtonText: string;
  hoverBg: string;
  iconBg: string;
  isLightTheme: boolean;
  insetBg: string;
  lineColor: string;
  mixBlendMode: 'multiply' | 'screen';
  mutedColor: string;
  ringClass: string;
  ringOffsetClass: string;
  softBg: string;
  subtleColor: string;
  textColor: string;
};

export function useSettingsSectionController() {
  const {
    customPrimaryColor,
    followSystemTheme,
    theme,
    setTheme,
    setFollowSystemTheme,
    primaryColor,
    setPrimaryColor,
    setCustomPrimaryColor,
    wallpaper,
    setWallpaper,
  } = useTheme();
  const manualTheme = useThemeStore((state) => state.theme);
  const { languageOptions, t } = useI18n();
  const { logout, config } = useAuth();
  const { clearConfig } = useConfig();
  const disableAnimations = useSettingsStore((state) => state.disableAnimations);
  const effectsQuality = useSettingsStore((state) => state.effectsQuality);
  const lowPowerMode = useSettingsStore((state) => state.lowPowerMode);
  const language = useSettingsStore((state) => state.language);
  const pageZoom = useSettingsStore((state) => state.pageZoom);
  const temperatureUnit = useSettingsStore((state) => state.temperatureUnit);
  const use24HourTime = useSettingsStore((state) => state.use24HourTime);
  const entityInteractionMode = useSettingsStore((state) => state.entityInteractionMode);
  const ambientLightBleed = useSettingsStore((state) => state.ambientLightBleed);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const hiddenEntityIds = useDashboardEntitiesStore((state) => state.hiddenEntityIds);
  const showAllEntities = useDashboardEntitiesStore((state) => state.showAllEntities);
  const reopenOnboarding = useDashboardEntitiesStore((state) => state.reopenOnboarding);
  const setActiveSection = useNavigationStore((state) => state.setActiveSection);
  const setCurrentRoom = useNavigationStore((state) => state.setCurrentRoom);
  const [showLicense, setShowLicense] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showRevealAllConfirm, setShowRevealAllConfirm] = useState(false);
  const [showRestartOnboardingConfirm, setShowRestartOnboardingConfirm] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogout = () => {
    if (confirm(t('settings.feedback.logoutConfirm'))) {
      logout();
      toast.success(t('settings.feedback.logoutSuccess'));
    }
  };

  const handleResetConnection = () => {
    if (confirm(t('settings.feedback.resetConnectionConfirm'))) {
      clearConfig();
      logout();
      toast.info(t('settings.feedback.resetConnectionSuccess'));
    }
  };

  const handleWallpaperUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setWallpaper(await readFileAsDataUrl(file));
    } catch (error) {
      alert(error instanceof Error ? error.message : t('settings.feedback.wallpaperReadFailed'));
    }
  };

  const handleRemoveWallpaper = () => {
    setWallpaper(null);
  };

  const handleExportDashboardConfig = () => {
    downloadDashboardConfig();
    toast.success(t('settings.feedback.configExported'));
  };

  const handleImportDashboardConfig = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      await importDashboardConfigFromFile(file);
      toast.success(t('settings.feedback.configImported'));
      window.setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch {
      toast.error(t('settings.feedback.configImportFailed'));
    } finally {
      event.target.value = '';
    }
  };

  const handleRestartOnboarding = () => {
    setActiveSection('home');
    setCurrentRoom('All');
    reopenOnboarding();
    setShowRestartOnboardingConfirm(false);
  };

  const styles = getSettingsSectionStyles(theme, primaryColor);

  return {
    ambientLightBleed,
    config,
    customPrimaryColor,
    disableAnimations,
    effectsQuality,
    entityInteractionMode,
    followSystemTheme,
    setFollowSystemTheme,
    handleExportDashboardConfig,
    handleImportDashboardConfig,
    handleLogout,
    handleRemoveWallpaper,
    handleResetConnection,
    handleRestartOnboarding,
    handleWallpaperUpload,
    hiddenEntityIds,
    importInputRef,
    language,
    languageOptions,
    lowPowerMode,
    manualTheme,
    pageZoom,
    primaryColor,
    reopenOnboarding,
    setPrimaryColor,
    setCustomPrimaryColor,
    setShowLicense,
    setShowRestartOnboardingConfirm,
    setShowRevealAllConfirm,
    setShowTerms,
    setTheme,
    showAllEntities,
    showLicense,
    showRestartOnboardingConfirm,
    showRevealAllConfirm,
    showTerms,
    styles,
    theme,
    themeOptions: THEME_OPTIONS,
    temperatureUnit,
    colorOptions: PRIMARY_COLOR_OPTIONS,
    updateSettings,
    use24HourTime,
    wallpaper,
  };
}

export type SettingsSectionController = ReturnType<typeof useSettingsSectionController>;
export type SettingsInteractionOption = { value: EntityInteractionMode; label: string };
