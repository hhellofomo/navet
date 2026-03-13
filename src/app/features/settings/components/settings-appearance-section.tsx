import { Image as ImageIcon, Palette, Upload, X } from 'lucide-react';
import { ThemeAppearancePicker } from '@/app/components/shared/theme/theme-appearance-picker';
import type { SettingsSectionController } from '../hooks/use-settings-section-controller';
import { AmbientLightPreviewCard } from './ambient-light-preview-card';
import { SettingsItem, SettingsSectionShell } from './settings-section-shell';

interface SettingsAppearanceSectionProps {
  controller: SettingsSectionController;
}

export function SettingsAppearanceSection({ controller }: SettingsAppearanceSectionProps) {
  const {
    ambientLightBleed,
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
        title="Theme and accent"
        description="Choose the overall visual tone and key accent using the same picker shown during onboarding."
        styles={styles}
      >
        <ThemeAppearancePicker
          colorOptions={colorOptions}
          selectedAccent={primaryColor}
          selectedTheme={theme}
          themeOptions={themeOptions}
          onAccentChange={setPrimaryColor}
          onThemeChange={setTheme}
        />
      </SettingsItem>

      <SettingsItem
        title="Light card ambience"
        description="Choose whether active light cards spill ambient color into the dashboard or stay contained inside the card."
        styles={styles}
      >
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          <div
            className={`inline-flex w-fit rounded-full border p-1 ${styles.borderColor} ${styles.softBg}`}
          >
            {[
              { value: true, label: 'Ambient bleed' },
              { value: false, label: 'Contained' },
            ].map((option) => {
              const isActive = ambientLightBleed === option.value;
              return (
                <button
                  type="button"
                  key={option.label}
                  onClick={() => controller.updateSettings({ ambientLightBleed: option.value })}
                  style={
                    isActive
                      ? {
                          backgroundColor: styles.accentColor,
                          color: '#ffffff',
                        }
                      : {
                          color: undefined,
                        }
                  }
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    isActive ? 'shadow-sm' : styles.chipTextColor
                  }`}
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <AmbientLightPreviewCard
            accentColor={styles.accentColor}
            ambientLightBleed={ambientLightBleed}
            theme={theme}
          />
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
