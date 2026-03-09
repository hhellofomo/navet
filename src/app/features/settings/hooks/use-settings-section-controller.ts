import { type ChangeEvent, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
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
  dividerColor: string;
  hoverBg: string;
  iconBg: string;
  insetBg: string;
  lineColor: string;
  mutedColor: string;
  softBg: string;
  subtleColor: string;
  textColor: string;
};

export function useSettingsSectionController() {
  const { theme, setTheme, primaryColor, setPrimaryColor, wallpaper, setWallpaper } = useTheme();
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
    borderColor: theme === 'light' ? 'border-gray-200/80' : 'border-white/10',
    cardBg:
      theme === 'light' ? 'bg-white/92' : theme === 'contrast' ? 'bg-gray-950' : 'bg-gray-900/88',
    chipBg: theme === 'light' ? 'bg-gray-100' : theme === 'contrast' ? 'bg-black/50' : 'bg-white/5',
    chipHoverBg:
      theme === 'light'
        ? 'hover:bg-gray-200'
        : theme === 'contrast'
          ? 'hover:bg-white/20'
          : 'hover:bg-white/10',
    dividerColor: theme === 'light' ? 'divide-gray-200/80' : 'divide-white/10',
    hoverBg: theme === 'light' ? 'hover:bg-gray-100/90' : 'hover:bg-white/7',
    iconBg: theme === 'light' ? 'bg-gray-100' : 'bg-white/6',
    insetBg: theme === 'light' ? 'bg-white' : 'bg-black/20',
    lineColor: theme === 'light' ? 'border-gray-200/80' : 'border-white/10',
    mutedColor: theme === 'light' ? 'text-gray-700' : 'text-gray-300',
    softBg: theme === 'light' ? 'bg-gray-50/90' : 'bg-white/[0.04]',
    subtleColor: theme === 'light' ? 'text-gray-500' : 'text-gray-300',
    textColor: theme === 'light' ? 'text-gray-900' : 'text-white',
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
