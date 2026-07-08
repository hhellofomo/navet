import { useState } from 'react';
import { toast } from 'sonner';
import { PRIMARY_COLOR_OPTIONS, THEME_OPTIONS } from '../../../constants/theme-options';
import { useAuth } from '../../../contexts/auth-context';
import { useConfig } from '../../../contexts/config-context';
import { useTheme } from '../../../hooks';
import { getThemeColorValue } from '../../../utils/theme-colors';
import { SettingsView } from './SettingsView';

export function SettingsContainer() {
  const { theme, setTheme, primaryColor, setPrimaryColor, wallpaper, setWallpaper } = useTheme();
  const { logout, config } = useAuth();
  const { clearConfig } = useConfig();
  const [showLicense, setShowLicense] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

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

  return (
    <SettingsView
      theme={theme}
      setTheme={setTheme}
      primaryColor={primaryColor}
      setPrimaryColor={setPrimaryColor}
      wallpaper={wallpaper}
      setWallpaper={setWallpaper}
      config={config}
      showLicense={showLicense}
      setShowLicense={setShowLicense}
      showTerms={showTerms}
      setShowTerms={setShowTerms}
      themeOptions={THEME_OPTIONS}
      colorOptions={PRIMARY_COLOR_OPTIONS}
      getColorValue={getThemeColorValue}
      handleLogout={handleLogout}
      handleResetConnection={handleResetConnection}
    />
  );
}
