import { ArrowLeft, Check, Download, Layers3, Palette, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ThemeAppearancePicker } from '@/app/components/shared/theme/theme-appearance-picker';
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

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const previewTheme = step === 'theme' ? selectedTheme : theme;
  const previewAccent = step === 'theme' ? selectedAccent : primaryColor;
  const accentColor = getThemeColorValue(previewAccent);
  const isContrast = previewTheme === 'contrast';
  const bgColor =
    previewTheme === 'light'
      ? 'bg-white/95 border-gray-200/80'
      : isContrast
        ? 'bg-black border-white/16'
        : previewTheme === 'glass'
          ? 'bg-white/10 border-white/18'
          : 'bg-gray-950/95 border-white/10';
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
  const borderColor =
    previewTheme === 'light'
      ? 'border-gray-200/80'
      : isContrast
        ? 'border-white/16'
        : 'border-white/10';
  const disabledCardBg =
    previewTheme === 'light'
      ? 'bg-gray-50 opacity-70'
      : isContrast
        ? 'bg-black opacity-70'
        : previewTheme === 'glass'
          ? 'bg-white/8 opacity-70'
          : 'bg-white/5 opacity-70';
  const pillBg =
    previewTheme === 'light'
      ? 'bg-gray-100 text-gray-700'
      : isContrast
        ? 'bg-black text-white/72'
        : previewTheme === 'glass'
          ? 'bg-white/10 text-white/72'
          : 'bg-white/8 text-white/72';
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
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/55 p-4 safe-area-pt-4 backdrop-blur-sm sm:flex sm:items-center sm:justify-center"
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
        className={`relative mx-auto w-full max-w-3xl rounded-[32px] border ${bgColor} p-6 shadow-2xl max-sm:min-h-[calc(100dvh-2rem)] max-sm:overflow-y-auto sm:max-h-[calc(100dvh-2rem)] sm:overflow-y-auto md:p-8`}
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
          <div className="mt-8">
            <ThemeAppearancePicker
              colorOptions={PRIMARY_COLOR_OPTIONS}
              selectedAccent={selectedAccent}
              selectedTheme={selectedTheme}
              themeOptions={THEME_OPTIONS}
              onAccentChange={setSelectedAccent}
              onThemeChange={setSelectedTheme}
              lead={
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
              }
            />
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
