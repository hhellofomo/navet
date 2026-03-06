import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/auth-context';
import { useConfig } from '../../../contexts/config-context';
import { type PrimaryColor, type ThemeType, useTheme } from '../../../contexts/theme-context';
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

  const _handleWallpaperUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setWallpaper(result);
    };
    reader.readAsDataURL(file);
  };

  const _handleRemoveWallpaper = () => {
    setWallpaper(null);
  };

  const themeOptions: Array<{ value: ThemeType; label: string; description: string }> = [
    {
      value: 'dark',
      label: 'Dark',
      description: 'Subtle gradients with muted colors',
    },
    {
      value: 'light',
      label: 'Light',
      description: 'Bright pastels with soft accents',
    },
    {
      value: 'contrast',
      label: 'High Contrast',
      description: 'Vibrant colors for better visibility',
    },
  ];

  const colorOptions: Array<{ value: PrimaryColor; label: string; color: string }> = [
    { value: 'orange', label: 'Orange', color: '#f97316' },
    { value: 'blue', label: 'Blue', color: '#3b82f6' },
    { value: 'green', label: 'Green', color: '#22c55e' },
    { value: 'purple', label: 'Purple', color: '#a855f7' },
    { value: 'pink', label: 'Pink', color: '#ec4899' },
    { value: 'red', label: 'Red', color: '#ef4444' },
    { value: 'yellow', label: 'Yellow', color: '#eab308' },
    { value: 'teal', label: 'Teal', color: '#14b8a6' },
  ];

  const getColorValue = (color: PrimaryColor): string => {
    const colors: Record<PrimaryColor, string> = {
      orange: '#f97316',
      blue: '#3b82f6',
      green: '#22c55e',
      purple: '#a855f7',
      pink: '#ec4899',
      red: '#ef4444',
      yellow: '#eab308',
      teal: '#14b8a6',
    };
    return colors[color];
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
      themeOptions={themeOptions}
      colorOptions={colorOptions}
      getColorValue={getColorValue}
      handleLogout={handleLogout}
      handleResetConnection={handleResetConnection}
    />
  );
}
