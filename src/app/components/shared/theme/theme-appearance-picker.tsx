import { Check } from 'lucide-react';
import { SettingsLivePreviewFrame } from '@/app/components/shared/settings-live-preview-frame';
import type { PrimaryColorOption, ThemeOption } from '@/app/constants/theme-options';
import { useI18n } from '@/app/hooks';
import type { PrimaryColor, ThemeType } from '@/app/hooks/use-theme';
import { getThemeAppearancePickerTokens } from './theme-appearance-picker-tokens';
import { getThemeColorValue } from './theme-colors';

interface ThemeAppearancePickerProps {
  colorOptions: PrimaryColorOption[];
  selectedAccent: PrimaryColor;
  selectedTheme: ThemeType;
  themeOptions: ThemeOption[];
  onAccentChange: (accent: PrimaryColor) => void;
  onThemeChange: (theme: ThemeType) => void;
  lead?: React.ReactNode;
}

export function ThemeAppearancePicker({
  colorOptions,
  selectedAccent,
  selectedTheme,
  themeOptions,
  onAccentChange,
  onThemeChange,
  lead,
}: ThemeAppearancePickerProps) {
  const { t } = useI18n();
  const accentColor = getThemeColorValue(selectedAccent);
  const previewTheme = selectedTheme;
  const pickerTokens = getThemeAppearancePickerTokens(previewTheme, accentColor);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className={`rounded-[28px] border p-5 ${pickerTokens.panelInsetClassName}`}>
        {lead ? <div className="mb-6">{lead}</div> : null}

        <div>
          <p className={`text-sm font-semibold ${pickerTokens.textClassName}`}>
            {t('themePicker.themeMode')}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {themeOptions.map((option) => {
              const isActive = selectedTheme === option.value;
              const optionLabel = t(option.labelKey);
              const optionDescription = t(option.descriptionKey);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onThemeChange(option.value)}
                  className={`flex h-full flex-col items-start justify-start rounded-[22px] border px-4 py-4 text-left transition-all sm:min-h-[144px] ${pickerTokens.optionBorderClassName} ${pickerTokens.optionCardClassName} ${
                    isActive ? 'shadow-sm' : ''
                  }`}
                  style={isActive ? pickerTokens.activeOptionStyle : undefined}
                >
                  <p
                    className={`text-sm font-semibold ${pickerTokens.textClassName}`}
                    style={isActive ? { color: accentColor } : undefined}
                  >
                    {optionLabel}
                  </p>
                  <p className={`mt-1 text-xs leading-relaxed ${pickerTokens.mutedClassName}`}>
                    {optionDescription}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <p className={`text-sm font-semibold ${pickerTokens.textClassName}`}>
            {t('themePicker.accentColor')}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {colorOptions.map((option) => {
              const isActive = selectedAccent === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onAccentChange(option.value)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform ${
                    isActive ? 'scale-110 ring-2 ring-offset-2' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: option.color,
                    ...(isActive
                      ? {
                          boxShadow: `${pickerTokens.accentRingShadow}${option.color}`,
                        }
                      : undefined),
                  }}
                  title={option.label}
                  aria-label={`Select ${option.label} accent color`}
                >
                  {isActive ? (
                    <Check className="h-4 w-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <SettingsLivePreviewFrame
        accentColor={accentColor}
        theme={selectedTheme}
        title="Navet"
        subtitle={t('themePicker.previewSubtitle', {
          mode: t(
            themeOptions.find((option) => option.value === selectedTheme)?.labelKey ??
              'themeOption.light.label'
          ),
        })}
        background={pickerTokens.previewBackground}
        topBar={
          <div
            className="h-3 w-16 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
            }}
          />
        }
      >
        <div className="grid gap-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="rounded-[18px] border p-3"
              style={{
                borderColor: `${accentColor}${index === 0 ? '55' : '22'}`,
                backgroundColor: pickerTokens.previewCardBackground(index),
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-2xl"
                  style={{ backgroundColor: `${accentColor}26` }}
                />
                <div className="flex-1">
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: index === 0 ? '58%' : index === 1 ? '44%' : '50%',
                      backgroundColor: pickerTokens.previewPrimaryBarColor,
                    }}
                  />
                  <div
                    className="mt-2 h-2 rounded-full"
                    style={{
                      width: index === 0 ? '36%' : '28%',
                      backgroundColor: pickerTokens.previewSecondaryBarColor,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SettingsLivePreviewFrame>
    </div>
  );
}
