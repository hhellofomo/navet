import { Check } from 'lucide-react';
import { ColorInputSwatch } from '@/app/components/shared/color-input-swatch';
import type { PrimaryColorOption, ThemeOption } from '@/app/constants/theme-options';
import { useI18n } from '@/app/hooks';
import type { PrimaryColor, ThemeType } from '@/app/hooks/use-theme';
import { getThemeAppearancePickerTokens } from './theme-appearance-picker-tokens';
import { getThemeColorValue } from './theme-colors';

interface ThemeAppearancePickerProps {
  colorOptions: PrimaryColorOption[];
  customAccent: string | null;
  selectedAccent: PrimaryColor;
  selectedTheme: ThemeType;
  themeOptions: ThemeOption[];
  onAccentChange: (accent: PrimaryColor) => void;
  onCustomAccentChange: (accent: string | null) => void;
  onThemeChange: (theme: ThemeType) => void;
  lead?: React.ReactNode;
}

export function ThemeAppearancePicker({
  colorOptions,
  customAccent,
  selectedAccent,
  selectedTheme,
  themeOptions,
  onAccentChange,
  onCustomAccentChange,
  onThemeChange,
  lead,
}: ThemeAppearancePickerProps) {
  const { t } = useI18n();
  const customAccentValue = customAccent ?? '#f97316';
  const accentColor =
    selectedAccent === 'custom' && customAccent ? customAccent : getThemeColorValue(selectedAccent);
  const previewTheme = selectedTheme;
  const pickerTokens = getThemeAppearancePickerTokens(previewTheme, accentColor);

  return (
    <div>
      <div
        className={`rounded-[22px] border p-4 md:rounded-[28px] md:p-5 ${pickerTokens.panelInsetClassName}`}
      >
        {lead ? <div className="mb-4 md:mb-6">{lead}</div> : null}

        <div>
          <p className={`text-sm font-semibold ${pickerTokens.textClassName}`}>
            {t('themePicker.themeMode')}
          </p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2 md:gap-3">
            {themeOptions.map((option) => {
              const isActive = selectedTheme === option.value;
              const optionLabel = t(option.labelKey);
              const optionDescription = t(option.descriptionKey);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onThemeChange(option.value)}
                  className={`flex flex-col items-start justify-start rounded-[18px] border px-3.5 py-3.5 text-left transition-all md:rounded-[22px] md:px-4 md:py-4 ${pickerTokens.optionBorderClassName} ${pickerTokens.optionCardClassName} ${
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

        <div className="mt-5 md:mt-6">
          <p className={`text-sm font-semibold ${pickerTokens.textClassName}`}>
            {t('themePicker.accentColor')}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2.5 md:gap-3">
            {colorOptions
              .filter((option) => option.value !== 'custom')
              .map((option) => {
                const isActive = selectedAccent === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onAccentChange(option.value)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform md:h-12 md:w-12 ${
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
            <ColorInputSwatch
              value={customAccentValue}
              ariaLabel={t('themePicker.customAccent')}
              title={t('themePicker.customAccent')}
              size="medium"
              selected={selectedAccent === 'custom'}
              ringColor={customAccentValue}
              onClick={() => onAccentChange('custom')}
              onChange={(value) => {
                onCustomAccentChange(value);
                onAccentChange('custom');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
