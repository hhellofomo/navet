import { ArrowLeft, Check, Download, Layers3, Palette, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { PRIMARY_COLOR_OPTIONS, THEME_OPTIONS } from '@/app/constants/theme-options';
import { useTheme } from '@/app/hooks';
import type { PrimaryColor, ThemeType } from '@/app/hooks/use-theme';

interface DashboardOnboardingDialogProps {
  open: boolean;
  onChooseAll: () => void;
  onChooseBlank: () => void;
  onImportConfig: (file: File) => Promise<void>;
  phase?: 'idle' | 'closing';
  onClosingAnimationComplete?: () => void;
}

type WizardRoute = 'all' | 'blank' | null;
type WizardStep = 'route' | 'theme';

export function DashboardOnboardingDialog({
  open,
  onChooseAll,
  onChooseBlank,
  onImportConfig,
  phase = 'idle',
  onClosingAnimationComplete,
}: DashboardOnboardingDialogProps) {
  const { theme, primaryColor, setPrimaryColor, setTheme } = useTheme();
  const [isImporting, setIsImporting] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<WizardRoute>(null);
  const [step, setStep] = useState<WizardStep>('route');
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(theme);
  const [selectedAccent, setSelectedAccent] = useState<PrimaryColor>(primaryColor);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setStep('route');
    setSelectedRoute(null);
    setSelectedTheme(theme);
    setSelectedAccent(primaryColor);
  }, [open, primaryColor, theme]);

  useEffect(() => {
    if (phase !== 'closing' || !onClosingAnimationComplete) {
      return;
    }

    const timeoutId = window.setTimeout(onClosingAnimationComplete, 900);
    return () => window.clearTimeout(timeoutId);
  }, [onClosingAnimationComplete, phase]);

  if (!open) return null;

  const previewTheme = step === 'theme' ? selectedTheme : theme;
  const previewAccent = step === 'theme' ? selectedAccent : primaryColor;
  const accentColor = getThemeColorValue(previewAccent);
  const bgColor =
    previewTheme === 'light'
      ? 'bg-white/95 border-gray-200/80'
      : previewTheme === 'glass'
        ? 'bg-white/10 border-white/18'
        : 'bg-gray-950/95 border-white/10';
  const textColor = previewTheme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedColor = previewTheme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const cardBg =
    previewTheme === 'light'
      ? 'bg-gray-50 hover:bg-gray-100'
      : previewTheme === 'glass'
        ? 'bg-white/8 hover:bg-white/12'
        : 'bg-white/5 hover:bg-white/10';
  const borderColor = previewTheme === 'light' ? 'border-gray-200/80' : 'border-white/10';
  const disabledCardBg =
    previewTheme === 'light'
      ? 'bg-gray-50 opacity-70'
      : previewTheme === 'glass'
        ? 'bg-white/8 opacity-70'
        : 'bg-white/5 opacity-70';
  const pillBg =
    previewTheme === 'light'
      ? 'bg-gray-100 text-gray-700'
      : previewTheme === 'glass'
        ? 'bg-white/10 text-white/72'
        : 'bg-white/8 text-white/72';
  const panelInset =
    previewTheme === 'light'
      ? 'bg-gray-50/90 border-gray-200/80'
      : previewTheme === 'glass'
        ? 'bg-white/[0.06] border-white/16'
        : 'bg-white/[0.045] border-white/10';

  const handleImportFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      await onImportConfig(file);
    } finally {
      event.target.value = '';
      setIsImporting(false);
    }
  };

  const isClosing = phase === 'closing';
  const routeLabel =
    selectedRoute === 'all' ? 'Start with all entities' : 'Start with a blank dashboard';

  const handleContinueToTheme = (route: Exclude<WizardRoute, null>) => {
    setSelectedRoute(route);
    setSelectedTheme(theme);
    setSelectedAccent(primaryColor);
    setStep('theme');
  };

  const handleFinishThemeSetup = () => {
    setTheme(selectedTheme);
    setPrimaryColor(selectedAccent);

    if (selectedRoute === 'all') {
      onChooseAll();
      return;
    }

    if (selectedRoute === 'blank') {
      onChooseBlank();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      style={{
        animation: isClosing ? 'navet-onboarding-backdrop-exit 0.9s ease forwards' : undefined,
      }}
    >
      <style>{`
        @keyframes navet-onboarding-backdrop-exit {
          0% { opacity: 1; backdrop-filter: blur(10px); }
          100% { opacity: 0; backdrop-filter: blur(22px); }
        }

        @keyframes navet-onboarding-panel-exit {
          0% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          100% { opacity: 0; transform: translateY(26px) scale(0.94); filter: blur(10px); }
        }
      `}</style>
      <div
        className={`w-full max-w-3xl rounded-[32px] border ${bgColor} p-6 shadow-2xl md:p-8`}
        style={{
          animation: isClosing
            ? 'navet-onboarding-panel-exit 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards'
            : undefined,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${mutedColor}`}>
              Welcome
            </p>
            <h2 className={`mt-3 text-3xl font-semibold tracking-tight ${textColor}`}>
              {step === 'route'
                ? 'How should Navet start your dashboard?'
                : 'Set the initial look before your first reveal.'}
            </h2>
            <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${mutedColor}`}>
              {step === 'route'
                ? 'Pick a starting route once. Import jumps straight into restore, while fresh starts let you choose the initial theme first.'
                : 'Choose the base theme and accent color Navet should apply before the dashboard appears for the first time.'}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            {['route', 'theme'].map((item, index) => {
              const isActive = step === item;
              const isComplete = step === 'theme' && item === 'route';

              return (
                <div
                  key={item}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    isActive ? '' : pillBg
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${accentColor}20`,
                          color: accentColor,
                          border: `1px solid ${accentColor}44`,
                        }
                      : undefined
                  }
                >
                  {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                </div>
              );
            })}
          </div>
        </div>

        {step === 'route' ? (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={() => handleContinueToTheme('all')}
              disabled={isClosing}
              className={`flex h-full flex-col items-start rounded-[28px] border ${borderColor} ${cardBg} p-6 text-left transition-colors`}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${accentColor}22` }}
              >
                <Sparkles className="h-5 w-5" style={{ color: accentColor }} />
              </div>
              <h3 className={`mt-5 text-lg font-semibold ${textColor}`}>Start with all entities</h3>
              <p className={`mt-2 text-sm leading-relaxed ${mutedColor}`}>
                Show everything Home Assistant exposes, then hide what you do not want.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleContinueToTheme('blank')}
              disabled={isClosing}
              className={`flex h-full flex-col items-start rounded-[28px] border ${borderColor} ${cardBg} p-6 text-left transition-colors`}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${accentColor}22` }}
              >
                <Layers3 className="h-5 w-5" style={{ color: accentColor }} />
              </div>
              <h3 className={`mt-5 text-lg font-semibold ${textColor}`}>
                Start with a blank dashboard
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${mutedColor}`}>
                Start with an empty dashboard, then add back only the entities you want from Add
                Entity.
              </p>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting || isClosing}
              className={`flex h-full flex-col items-start rounded-[28px] border ${borderColor} ${
                isImporting || isClosing ? disabledCardBg : cardBg
              } p-6 text-left transition-colors disabled:cursor-wait`}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${accentColor}22` }}
              >
                <Download className="h-5 w-5" style={{ color: accentColor }} />
              </div>
              <h3 className={`mt-5 text-lg font-semibold ${textColor}`}>
                {isClosing
                  ? 'Preparing your reveal...'
                  : isImporting
                    ? 'Importing config...'
                    : 'Import a config file'}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${mutedColor}`}>
                {isClosing
                  ? 'Sealing the onboarding experience and transitioning into your restored dashboard.'
                  : 'Restore a previously exported Navet YAML dashboard config instead of starting from scratch.'}
              </p>
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className={`rounded-[28px] border ${panelInset} p-5`}>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${accentColor}22` }}
                >
                  <Palette className="h-5 w-5" style={{ color: accentColor }} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${textColor}`}>{routeLabel}</p>
                  <p className={`text-xs ${mutedColor}`}>Step 2 of 2: initial theme setup</p>
                </div>
              </div>

              <div className="mt-6">
                <p className={`text-sm font-semibold ${textColor}`}>Theme mode</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {THEME_OPTIONS.map((option) => {
                    const isActive = selectedTheme === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedTheme(option.value)}
                        className={`flex h-full flex-col items-start justify-start rounded-[22px] border px-4 py-4 text-left transition-all ${cardBg} ${
                          isActive ? 'shadow-sm' : ''
                        }`}
                        style={
                          isActive
                            ? {
                                borderColor: `${accentColor}80`,
                                backgroundColor: `${accentColor}14`,
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
                  {PRIMARY_COLOR_OPTIONS.map((option) => {
                    const isActive = selectedAccent === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedAccent(option.value)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform ${
                          isActive ? 'scale-110 ring-2 ring-offset-2' : 'hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: option.color,
                          ...(isActive
                            ? {
                                boxShadow: `0 0 0 2px ${
                                  previewTheme === 'light' ? '#ffffff' : '#111827'
                                }, 0 0 0 4px ${option.color}`,
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
                        ? `linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))`
                        : previewTheme === 'contrast'
                          ? `linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0.985))`
                          : `linear-gradient(180deg, rgba(17,24,39,0.94), rgba(3,7,18,0.96))`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold ${textColor}`}>Navet</p>
                    <p className={`text-xs ${mutedColor}`}>
                      {THEME_OPTIONS.find((option) => option.value === selectedTheme)?.label} mode
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
                                  ? `${accentColor}18`
                                  : 'rgba(255,255,255,0.02)'
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
        )}

        {step === 'theme' ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep('route')}
              disabled={isClosing}
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium ${borderColor} ${textColor}`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleFinishThemeSetup}
              disabled={isClosing}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                boxShadow: `0 18px 40px ${accentColor}40`,
              }}
            >
              Continue to my dashboard
            </button>
          </div>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept=".yaml,.yml,application/yaml,text/yaml"
          className="hidden"
          onChange={handleImportFileChange}
        />
      </div>
    </div>
  );
}
