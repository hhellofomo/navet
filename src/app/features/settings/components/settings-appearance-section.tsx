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
          <div className="grid gap-2 md:grid-cols-2">
            {themeOptions.map((option) => {
              const isActive = theme === option.value;
              const previewScene =
                option.value === 'light'
                  ? 'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.7), transparent 30%), linear-gradient(135deg, rgba(248,250,252,0.98), rgba(226,232,240,0.82))'
                  : option.value === 'glass'
                    ? 'radial-gradient(circle at 18% 18%, rgba(56,189,248,0.22), transparent 28%), radial-gradient(circle at 82% 78%, rgba(20,184,166,0.18), transparent 34%), linear-gradient(135deg, rgba(8,15,31,1), rgba(15,23,42,1) 55%, rgba(2,6,23,1))'
                    : option.value === 'contrast'
                      ? 'linear-gradient(135deg, rgba(0,0,0,1), rgba(10,10,10,1))'
                      : 'radial-gradient(circle at 20% 16%, rgba(59,130,246,0.12), transparent 26%), linear-gradient(135deg, rgba(15,23,42,1), rgba(17,24,39,1) 45%, rgba(2,6,23,1))';
              const previewShell =
                option.value === 'light'
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(241,245,249,0.92))'
                  : option.value === 'glass'
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08) 58%, rgba(255,255,255,0.04))'
                    : option.value === 'contrast'
                      ? 'linear-gradient(135deg, rgba(0,0,0,0.98), rgba(10,10,10,1))'
                      : 'linear-gradient(135deg, rgba(17,24,39,0.96), rgba(3,7,18,0.96))';
              const previewShellBorder =
                option.value === 'light'
                  ? 'rgba(148,163,184,0.2)'
                  : option.value === 'glass'
                    ? 'rgba(255,255,255,0.16)'
                    : option.value === 'contrast'
                      ? 'rgba(255,255,255,0.16)'
                      : 'rgba(255,255,255,0.1)';
              const previewText =
                option.value === 'light'
                  ? 'rgba(148,163,184,0.78)'
                  : option.value === 'contrast'
                    ? 'rgba(255,255,255,0.52)'
                    : option.value === 'glass'
                      ? 'rgba(255,255,255,0.42)'
                      : 'rgba(255,255,255,0.44)';
              const previewMutedText =
                option.value === 'light'
                  ? 'rgba(203,213,225,0.95)'
                  : option.value === 'contrast'
                    ? 'rgba(255,255,255,0.28)'
                    : option.value === 'glass'
                      ? 'rgba(255,255,255,0.18)'
                      : 'rgba(255,255,255,0.2)';
              const previewTrack =
                option.value === 'light'
                  ? 'rgba(203,213,225,0.8)'
                  : option.value === 'contrast'
                    ? 'rgba(255,255,255,0.1)'
                    : option.value === 'glass'
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(255,255,255,0.06)';
              const previewButton =
                option.value === 'light'
                  ? 'rgba(226,232,240,0.95)'
                  : option.value === 'contrast'
                    ? 'rgba(255,255,255,0.08)'
                    : option.value === 'glass'
                      ? 'rgba(255,255,255,0.045)'
                      : 'rgba(255,255,255,0.05)';
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex h-full flex-col items-start rounded-[22px] border px-4 py-4 text-left transition-all ${
                    isActive ? 'shadow-sm' : styles.hoverBg
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: styles.isLightTheme ? '#ffffff' : undefined,
                          border: `1px solid ${styles.accentColor}`,
                          boxShadow: styles.elevatedShadow,
                        }
                      : {
                          borderColor: 'transparent',
                        }
                  }
                >
                  <div className="relative mb-4 h-[190px] w-full overflow-hidden px-2 py-2">
                    <div
                      className="absolute inset-0 rounded-[28px]"
                      style={{ background: previewScene }}
                    />
                    {option.value !== 'contrast' && option.value !== 'light' ? (
                      <div
                        className="absolute left-[-12px] top-[-10px] h-24 w-24 rounded-full blur-3xl"
                        style={{
                          backgroundColor:
                            option.value === 'glass'
                              ? `${styles.accentColor}2e`
                              : `${styles.accentColor}1a`,
                        }}
                      />
                    ) : null}
                    {option.value === 'glass' ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.02]" />
                    ) : null}
                    <div
                      className="absolute inset-x-6 bottom-5 top-5 flex flex-col rounded-[28px] border p-4"
                      style={{
                        background: previewShell,
                        borderColor: previewShellBorder,
                        boxShadow:
                          option.value === 'light'
                            ? '0 16px 32px rgba(148,163,184,0.12)'
                            : '0 18px 36px rgba(0,0,0,0.22)',
                      }}
                    >
                      <div className="mb-3 flex items-start gap-3">
                        <div
                          className="h-8 w-8 rounded-full border"
                          style={{
                            backgroundColor:
                              option.value === 'light'
                                ? '#ffffff'
                                : option.value === 'glass'
                                  ? 'rgba(255,255,255,0.14)'
                                  : option.value === 'contrast'
                                    ? '#111111'
                                    : 'rgba(255,255,255,0.08)',
                            borderColor:
                              option.value === 'light'
                                ? 'rgba(148,163,184,0.32)'
                                : 'rgba(255,255,255,0.12)',
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div
                            className="h-3 w-20 rounded-full"
                            style={{ backgroundColor: previewText }}
                          />
                          <div
                            className="mt-1.5 h-2 w-10 rounded-full"
                            style={{ backgroundColor: previewMutedText }}
                          />
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="mb-1.5 flex items-center justify-between">
                          <div
                            className="h-2 w-12 rounded-full"
                            style={{ backgroundColor: previewMutedText }}
                          />
                          <div
                            className="h-2.5 w-8 rounded-full"
                            style={{ backgroundColor: previewText }}
                          />
                        </div>
                        <div className="h-2 rounded-full" style={{ backgroundColor: previewTrack }}>
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: '68%',
                              backgroundColor: styles.accentColor,
                            }}
                          />
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {[0, 1, 2].map((previewIndex) => (
                              <div
                                key={previewIndex}
                                className="rounded-full"
                                style={{
                                  height: '1.75rem',
                                  width: '1.75rem',
                                  backgroundColor:
                                    previewIndex === 2
                                      ? `${styles.accentColor}${option.value === 'light' ? '22' : '33'}`
                                      : previewButton,
                                }}
                              />
                            ))}
                          </div>
                          <div
                            className="h-8 w-8 rounded-full"
                            style={{ backgroundColor: previewButton }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
