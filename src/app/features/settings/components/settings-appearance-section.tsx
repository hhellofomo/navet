import { Image as ImageIcon, Palette, Upload, X } from 'lucide-react';
import type { SettingsSectionController } from '../hooks/use-settings-section-controller';
import { SettingsItem, SettingsSectionShell } from './settings-section-shell';

interface SettingsAppearanceSectionProps {
  controller: SettingsSectionController;
}

export function SettingsAppearanceSection({ controller }: SettingsAppearanceSectionProps) {
  const {
    colorOptions,
    handleRemoveWallpaper,
    handleWallpaperUpload,
    primaryColor,
    setPrimaryColor,
    setTheme,
    styles,
    theme,
    themeOptions,
    wallpaper,
  } = controller;

  return (
    <SettingsSectionShell
      id="appearance"
      icon={Palette}
      title="Appearance"
      description="Visual decisions that define the overall feel of the dashboard."
      styles={styles}
    >
      <SettingsItem
        title="Theme mode"
        description="Choose the overall visual tone before adjusting accent details."
        styles={styles}
      >
        <div className={`rounded-[28px] p-2 ${styles.softBg}`}>
          <div className="grid gap-2 md:grid-cols-3">
            {themeOptions.map((option) => {
              const isActive = theme === option.value;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`rounded-[22px] px-4 py-4 text-left transition-all ${
                    isActive ? 'shadow-sm' : styles.hoverBg
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: styles.isLightTheme ? '#ffffff' : undefined,
                          border: `1px solid ${styles.accentColor}`,
                          boxShadow: styles.elevatedShadow,
                        }
                      : undefined
                  }
                >
                  <p
                    className={`text-sm font-semibold ${isActive ? '' : styles.textColor}`}
                    style={isActive ? { color: styles.accentColor } : undefined}
                  >
                    {option.label}
                  </p>
                  <p className={`mt-1 text-xs leading-relaxed ${styles.subtleColor}`}>
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </SettingsItem>

      <SettingsItem
        title="Accent color"
        description="Used for active states, selected controls, and the most important UI highlights."
        styles={styles}
      >
        <div className="flex flex-wrap items-center gap-3">
          {colorOptions.map((option) => {
            const isActive = primaryColor === option.value;
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => setPrimaryColor(option.value)}
                className={`h-11 w-11 rounded-full transition-all duration-300 ${
                  isActive
                    ? `ring-2 ${styles.ringClass} ring-offset-2 ${styles.ringOffsetClass}`
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: option.color }}
                title={option.label}
              />
            );
          })}
        </div>
      </SettingsItem>

      <SettingsItem
        title="Wallpaper"
        description="Add a background image that blends with the active accent and theme."
        styles={styles}
      >
        {wallpaper ? (
          <div className="relative max-w-2xl">
            <div
              className="relative h-36 overflow-hidden rounded-[24px] border"
              style={{ borderColor: `${styles.accentColor}40` }}
            >
              <img src={wallpaper} alt="Wallpaper preview" className="h-full w-full object-cover" />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${styles.accentColor}55, ${styles.accentColor}10)`,
                  mixBlendMode: styles.mixBlendMode,
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleRemoveWallpaper}
              className={`absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full ${styles.floatingButtonBg} ${styles.floatingButtonText} shadow-lg transition-all hover:scale-110`}
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <label
              className={`mt-4 flex h-16 cursor-pointer items-center justify-center gap-3 rounded-[20px] border-2 border-dashed ${styles.lineColor} transition-colors ${styles.hoverBg}`}
            >
              <Upload className={`h-4 w-4 ${styles.mutedColor}`} />
              <div className="text-center">
                <p className={`text-sm font-medium ${styles.textColor}`}>Replace wallpaper</p>
                <p className={`text-[11px] ${styles.subtleColor}`}>PNG, JPG up to 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleWallpaperUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <label
            className={`flex h-36 max-w-2xl cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed ${styles.lineColor} text-center transition-colors ${styles.hoverBg}`}
          >
            <ImageIcon className={`mb-3 h-9 w-9 ${styles.mutedColor}`} />
            <span className={`text-sm font-medium ${styles.textColor}`}>Upload wallpaper</span>
            <span className={`mt-1 text-[11px] ${styles.subtleColor}`}>PNG, JPG up to 5MB</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleWallpaperUpload}
              className="hidden"
            />
          </label>
        )}
      </SettingsItem>
    </SettingsSectionShell>
  );
}
