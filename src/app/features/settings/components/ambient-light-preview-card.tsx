import { Lightbulb } from 'lucide-react';
import { SettingsLivePreviewFrame } from '@/app/components/shared/settings-live-preview-frame';
import { getThemeAppearancePickerTokens } from '@/app/components/shared/theme/theme-appearance-picker-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';

interface AmbientLightPreviewCardProps {
  accentColor: string;
  ambientLightBleed: boolean;
  theme: ThemeType;
}

export function AmbientLightPreviewCard({
  accentColor,
  ambientLightBleed,
  theme,
}: AmbientLightPreviewCardProps) {
  const isLightTheme = theme === 'light';
  const isContrastTheme = theme === 'contrast';
  const previewTokens = getThemeAppearancePickerTokens(theme, accentColor);

  const previewSurfaceClassName = isLightTheme
    ? 'bg-transparent'
    : isContrastTheme
      ? 'bg-black border-white/16'
      : theme === 'glass'
        ? 'bg-[#111827]/72 border-white/10'
        : 'bg-gray-900/95 border-white/10';
  const previewCardClassName = isLightTheme
    ? 'bg-white/92 border-gray-200/80'
    : isContrastTheme
      ? 'bg-black border-white/16'
      : theme === 'glass'
        ? 'bg-white/10 border-white/12'
        : 'bg-white/6 border-white/10';
  const primaryBarColor = previewTokens.previewPrimaryBarColor;
  const secondaryBarColor = previewTokens.previewSecondaryBarColor;
  const glowOpacityClassName = ambientLightBleed
    ? isLightTheme
      ? 'opacity-100'
      : 'opacity-95'
    : 'opacity-8';

  return (
    <SettingsLivePreviewFrame
      accentColor={accentColor}
      theme={theme}
      title="Light card"
      subtitle={ambientLightBleed ? 'Ambient bleed enabled' : 'Contained inside card'}
      topBar={
        <div
          className="h-3 w-16 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
          }}
        />
      }
    >
      <div className={`relative rounded-[20px] ${previewSurfaceClassName}`}>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-[-22%] top-1/2 h-36 -translate-y-1/2 blur-3xl transition-opacity duration-300 ${glowOpacityClassName}`}
          style={{
            background: `radial-gradient(circle, ${accentColor}d9 0%, ${accentColor}73 24%, ${accentColor}26 54%, transparent 78%)`,
          }}
        />

        <div className={`relative z-10 rounded-[20px] border p-3 ${previewCardClassName}`}>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${accentColor}26` }}
            >
              <Lightbulb className="h-4 w-4" style={{ color: accentColor }} />
            </div>
            <div className="flex-1">
              <div
                className="h-3 rounded-full"
                style={{ width: '54%', backgroundColor: primaryBarColor }}
              />
              <div
                className="mt-2 h-2 rounded-full"
                style={{ width: '34%', backgroundColor: secondaryBarColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </SettingsLivePreviewFrame>
  );
}
