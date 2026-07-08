import { type ChangeEvent, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { PRIMARY_COLOR_OPTIONS, THEME_OPTIONS } from '@/app/constants/theme-options';
import { useAuth } from '@/app/contexts/auth-context';
import { useConfig } from '@/app/contexts/config-context';
import { useDashboardEntitiesStore } from '@/app/features/dashboard';
import { useTheme } from '@/app/hooks';
import { type EntityInteractionMode, useSettingsStore } from '@/app/stores';
import { useNavigationStore } from '@/app/stores/navigation-store';
import {
  downloadDashboardConfig,
  importDashboardConfigFromFile,
} from '@/app/utils/dashboard-config';
import { readFileAsDataUrl, validateImageFile } from '@/app/utils/image-upload';

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
  const { theme, setTheme, primaryColor, setPrimaryColor, wallpaper, setWallpaper } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const { logout, config } = useAuth();
  const { clearConfig } = useConfig();
  const disableAnimations = useSettingsStore((state) => state.disableAnimations);
  const entityInteractionMode = useSettingsStore((state) => state.entityInteractionMode);
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
    if (confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('Logged out successfully');
    }
  };

  const handleResetConnection = () => {
    if (
      confirm(
        'Are you sure you want to reset your smart home connection? You will need to reconnect.'
      )
    ) {
      clearConfig();
      logout();
      toast.info('Connection reset. Please reconnect to your system.');
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
      alert(error instanceof Error ? error.message : 'Failed to read image file');
    }
  };

  const handleRemoveWallpaper = () => {
    setWallpaper(null);
  };

  const handleExportDashboardConfig = () => {
    downloadDashboardConfig();
    toast.success('Dashboard config exported');
  };

  const handleImportDashboardConfig = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      await importDashboardConfigFromFile(file);
      toast.success('Dashboard config imported. Reloading...');
      window.setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch {
      toast.error('Failed to import dashboard config');
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

  const styles: SettingsSectionStyles = {
    accentColor: getThemeColorValue(primaryColor),
    borderColor: surface.borderStrong,
    cardBg:
      theme === 'light'
        ? 'bg-white/92'
        : theme === 'contrast'
          ? 'bg-gray-950'
          : theme === 'glass'
            ? 'bg-white/[0.10]'
            : 'bg-gray-900/88',
    chipBg: theme === 'contrast' ? 'bg-black/50' : surface.subtleBg,
    chipHoverBg:
      theme === 'light'
        ? 'hover:bg-gray-200'
        : theme === 'contrast'
          ? 'hover:bg-white/20'
          : theme === 'glass'
            ? 'hover:bg-white/16'
          : 'hover:bg-white/10',
    chipTextColor: theme === 'light' ? 'text-gray-600' : surface.textSecondary,
    dividerColor: surface.divider,
    elevatedShadow:
      theme === 'light'
        ? '0 10px 30px rgba(15, 23, 42, 0.06)'
        : '0 10px 30px rgba(0, 0, 0, 0.18)',
    floatingButtonBg: theme === 'light' ? 'bg-gray-900' : 'bg-white',
    floatingButtonText: theme === 'light' ? 'text-white' : 'text-gray-900',
    hoverBg: theme === 'light' ? 'hover:bg-gray-100/90' : surface.hoverBg,
    iconBg: surface.iconBg,
    isLightTheme: theme === 'light',
    insetBg: theme === 'light' ? 'bg-white' : theme === 'glass' ? 'bg-white/[0.06]' : 'bg-black/20',
    lineColor: surface.borderStrong,
    mixBlendMode: theme === 'light' ? 'multiply' : 'screen',
    mutedColor: theme === 'light' ? 'text-gray-700' : surface.textSecondary,
    ringClass: theme === 'light' ? 'ring-black/30' : 'ring-white/40',
    ringOffsetClass: theme === 'light' ? 'ring-offset-white' : 'ring-offset-gray-900',
    softBg: theme === 'light' ? 'bg-gray-50/90' : theme === 'glass' ? 'bg-white/[0.06]' : 'bg-white/[0.04]',
    subtleColor: surface.textMuted,
    textColor: surface.textPrimary,
  };

  return {
    config,
    disableAnimations,
    entityInteractionMode,
    handleExportDashboardConfig,
    handleImportDashboardConfig,
    handleLogout,
    handleRemoveWallpaper,
    handleResetConnection,
    handleRestartOnboarding,
    handleWallpaperUpload,
    hiddenEntityIds,
    importInputRef,
    primaryColor,
    reopenOnboarding,
    setPrimaryColor,
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
    colorOptions: PRIMARY_COLOR_OPTIONS,
    updateSettings,
    wallpaper,
  };
}

export type SettingsSectionController = ReturnType<typeof useSettingsSectionController>;
export type SettingsInteractionOption = { value: EntityInteractionMode; label: string };
