import { Check } from 'lucide-react';
import type { PrimaryColorOption, ThemeOption } from '@/app/constants/theme-options';
import type { PrimaryColor, ThemeType } from '@/app/hooks/use-theme';
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
  const accentColor = getThemeColorValue(selectedAccent);
  const previewTheme = selectedTheme;
  const isContrast = previewTheme === 'contrast';
  const textColor = previewTheme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedColor = previewTheme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const cardBg =
    previewTheme === 'light'
      ? 'bg-gray-50 hover:bg-gray-100'
      : isContrast
        ? 'bg-black hover:bg-black'
        : previewTheme === 'glass'
          ? 'bg-white/8 hover:bg-white/12'
          : 'bg-white/5 hover:bg-white/10';
  const cardBorder =
    previewTheme === 'light'
      ? 'border-gray-200/80'
      : isContrast
        ? 'border-white/16'
        : previewTheme === 'glass'
          ? 'border-white/16'
          : 'border-white/10';
  const panelInset =
    previewTheme === 'light'
      ? 'bg-gray-50/90 border-gray-200/80'
      : isContrast
        ? 'bg-black border-white/16'
        : previewTheme === 'glass'
          ? 'bg-white/[0.06] border-white/16'
          : 'bg-white/[0.045] border-white/10';

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className={`rounded-[28px] border ${panelInset} p-5`}>
        {lead ? <div className="mb-6">{lead}</div> : null}

        <div>
          <p className={`text-sm font-semibold ${textColor}`}>Theme mode</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {themeOptions.map((option) => {
              const isActive = selectedTheme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onThemeChange(option.value)}
                  className={`flex h-full flex-col items-start justify-start rounded-[22px] border px-4 py-4 text-left transition-all sm:min-h-[144px] ${cardBorder} ${cardBg} ${
                    isActive ? 'shadow-sm' : ''
                  }`}
                  style={
                    isActive
                      ? {
                          borderColor: `${accentColor}80`,
                          backgroundColor: isContrast ? '#000000' : `${accentColor}14`,
                        }
                      : undefined
                  }
                >
                  <p
                    className={`text-sm font-semibold ${textColor}`}
                    style={isActive ? { color: accentColor } : undefined}
                  >
                    {option.label}
                  </p>
                  <p className={`mt-1 text-xs leading-relaxed ${mutedColor}`}>
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <p className={`text-sm font-semibold ${textColor}`}>Accent color</p>
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
                          boxShadow: `0 0 0 2px ${previewTheme === 'light' ? '#ffffff' : '#111827'}, 0 0 0 4px ${option.color}`,
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

      <div className={`rounded-[28px] border ${panelInset} p-5`}>
        <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${mutedColor}`}>
          Live Preview
        </p>
        <div
          className="mt-4 overflow-hidden rounded-[24px] border p-4"
          style={{
            borderColor: `${accentColor}33`,
            background:
              previewTheme === 'light'
                ? `linear-gradient(180deg, rgba(255,255,255,0.96), ${accentColor}10)`
                : previewTheme === 'glass'
                  ? 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))'
                  : previewTheme === 'contrast'
                    ? 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0.985))'
                    : 'linear-gradient(180deg, rgba(17,24,39,0.94), rgba(3,7,18,0.96))',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${textColor}`}>Navet</p>
              <p className={`text-xs ${mutedColor}`}>
                {themeOptions.find((option) => option.value === selectedTheme)?.label} mode
              </p>
            </div>
            <div
              className="h-3 w-16 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
              }}
            />
          </div>
          <div className="mt-5 grid gap-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="rounded-[18px] border p-3"
                style={{
                  borderColor: `${accentColor}${index === 0 ? '55' : '22'}`,
                  backgroundColor:
                    previewTheme === 'light'
                      ? index === 0
                        ? `${accentColor}12`
                        : 'rgba(255,255,255,0.92)'
                      : previewTheme === 'glass'
                        ? index === 0
                          ? `${accentColor}18`
                          : 'rgba(255,255,255,0.06)'
                        : previewTheme === 'contrast'
                          ? index === 0
                            ? 'rgba(0,0,0,1)'
                            : 'rgba(0,0,0,1)'
                          : index === 0
                            ? `${accentColor}16`
                            : 'rgba(255,255,255,0.05)',
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
                        backgroundColor:
                          previewTheme === 'light'
                            ? 'rgba(203, 213, 225, 0.96)'
                            : previewTheme === 'glass'
                              ? 'rgba(255,255,255,0.82)'
                              : 'rgba(255,255,255,0.86)',
                      }}
                    />
                    <div
                      className="mt-2 h-2 rounded-full"
                      style={{
                        width: index === 0 ? '36%' : '28%',
                        backgroundColor:
                          previewTheme === 'light'
                            ? 'rgba(226, 232, 240, 0.95)'
                            : previewTheme === 'glass'
                              ? 'rgba(255,255,255,0.32)'
                              : 'rgba(255,255,255,0.26)',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
