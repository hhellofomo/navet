import type { PrimaryColor, ThemeType } from '../../../contexts/theme-context';
import { AboutSection } from './AboutSection';
import { AppearanceSection } from './AppearanceSection';
import { ConnectionSection } from './ConnectionSection';
import { CreditsSection } from './CreditsSection';
import { LicenseSection } from './LicenseSection';
import { LogoutSection } from './LogoutSection';
import { TermsSection } from './TermsSection';

interface SettingsViewProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
  wallpaper: string | null;
  setWallpaper: (wallpaper: string | null) => void;
  config: { url: string; token: string } | null;
  showLicense: boolean;
  setShowLicense: (show: boolean) => void;
  showTerms: boolean;
  setShowTerms: (show: boolean) => void;
  themeOptions: Array<{ value: ThemeType; label: string; description: string }>;
  colorOptions: Array<{ value: PrimaryColor; label: string; color: string }>;
  getColorValue: (color: PrimaryColor) => string;
  handleLogout: () => void;
  handleResetConnection: () => void;
  handleWallpaperUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveWallpaper: () => void;
}

export function SettingsView({
  theme,
  setTheme,
  primaryColor,
  setPrimaryColor,
  wallpaper,
  setWallpaper,
  config,
  showLicense,
  setShowLicense,
  showTerms,
  setShowTerms,
  themeOptions,
  colorOptions,
  getColorValue,
  handleLogout,
  handleResetConnection,
}: SettingsViewProps) {
  const _bgColor = theme === 'light' ? 'bg-gray-50' : 'bg-[#0a0a0a]';
  const _cardBg =
    theme === 'light' ? 'bg-white' : theme === 'contrast' ? 'bg-gray-950' : 'bg-gray-900';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subtleColor = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
  const _borderColor = theme === 'light' ? 'border-gray-200' : 'border-white/10';

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-xl font-semibold ${textColor} mb-1`}>Settings</h1>
          <p className={`text-sm ${subtleColor}`}>Customize your dashboard</p>
        </div>

        <AppearanceSection
          theme={theme}
          setTheme={setTheme}
          primaryColor={primaryColor}
          setPrimaryColor={setPrimaryColor}
          wallpaper={wallpaper}
          setWallpaper={setWallpaper}
          themeOptions={themeOptions}
          colorOptions={colorOptions}
          getColorValue={getColorValue}
        />

        <ConnectionSection
          theme={theme}
          config={config}
          handleResetConnection={handleResetConnection}
        />

        <AboutSection theme={theme} />

        <LicenseSection theme={theme} showLicense={showLicense} setShowLicense={setShowLicense} />

        <TermsSection theme={theme} showTerms={showTerms} setShowTerms={setShowTerms} />

        <CreditsSection theme={theme} />

        <LogoutSection handleLogout={handleLogout} />
      </div>
    </div>
  );
}
