import { Hand, Lightbulb, MoreHorizontal, Settings2, Sun } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { EntityInteractionMode } from '@/app/stores';
import { getInteractionPreview } from './entity-card-interaction-controller';

interface InteractionPreviewCardProps {
  mode: EntityInteractionMode;
  accentColor: string;
  isLightTheme: boolean;
}

const PRESET_LABELS = ['25%', '60%', '100%'];

export function InteractionPreviewCard({
  mode,
  accentColor,
  isLightTheme,
}: InteractionPreviewCardProps) {
  const [isOn, setIsOn] = useState(true);
  const [brightness, setBrightness] = useState(60);
  const surface = getThemeSurfaceTokens(isLightTheme ? 'light' : 'glass');
  const preview = getInteractionPreview(mode);
  const showsTrailingButton = mode === 'toggle-first';
  const surfaceClass = isLightTheme
    ? 'bg-white border-gray-200/70'
    : `${surface.panel} ${surface.border}`;
  const cardClass = isLightTheme
    ? 'bg-gray-50/90 border-gray-200/80'
    : 'bg-white/8 border-white/12';
  const textClass = isOn
    ? isLightTheme
      ? 'text-gray-900'
      : 'text-white'
    : isLightTheme
      ? 'text-gray-500'
      : 'text-gray-400';
  const mutedClass = isOn
    ? isLightTheme
      ? 'text-gray-500'
      : 'text-gray-300'
    : isLightTheme
      ? 'text-gray-400'
      : 'text-gray-500';
  const quietPillClass = isOn
    ? isLightTheme
      ? 'bg-gray-100 text-gray-600'
      : 'bg-white/10 text-gray-300'
    : isLightTheme
      ? 'bg-gray-200/80 text-gray-500'
      : 'bg-white/5 text-gray-500';
  const iconButtonStyle = {
    backgroundColor: isOn ? (isLightTheme ? '#ffffff' : `${accentColor}cc`) : undefined,
    borderColor: isOn
      ? `${accentColor}55`
      : isLightTheme
        ? 'rgba(156, 163, 175, 0.45)'
        : 'rgba(255, 255, 255, 0.12)',
    color: isOn ? (isLightTheme ? accentColor : '#ffffff') : isLightTheme ? '#6b7280' : '#9ca3af',
    boxShadow: isLightTheme
      ? isOn
        ? `0 0 0 2px ${accentColor}22, 0 10px 28px ${accentColor}40`
        : 'none'
      : isOn
        ? `0 0 0 2px ${accentColor}22, 0 12px 30px ${accentColor}45`
        : 'none',
  };

  const showControlsOpenedToast = () => {
    toast.success('Controls opened', {
      description: 'This is where the full light controls would open.',
    });
  };

  const handleCardTap = () => {
    if (mode === 'toggle-first') {
      setIsOn((current) => !current);
      return;
    }
    showControlsOpenedToast();
  };

  return (
    <div className={`mt-5 max-w-xl rounded-[28px] border p-4 ${surfaceClass}`}>
      {/* biome-ignore lint/a11y/useSemanticElements: This preview card contains nested interactive controls, so a semantic button wrapper is not valid here. */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardTap}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleCardTap();
          }
        }}
        className={`rounded-[24px] border p-4 transition-all duration-300 cursor-pointer ${cardClass} ${
          !isOn ? 'grayscale opacity-40' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsOn((current) => !current);
              }}
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isLightTheme
                  ? 'focus-visible:ring-gray-900/25 focus-visible:ring-offset-white'
                  : 'focus-visible:ring-white/35 focus-visible:ring-offset-gray-950'
              } ${!isOn ? (isLightTheme ? 'bg-gray-200' : 'bg-white/5') : ''}`}
              style={iconButtonStyle}
            >
              <Lightbulb
                className="h-5 w-5"
                style={{
                  filter: isLightTheme ? undefined : 'drop-shadow(0 1px 6px rgba(0, 0, 0, 0.35))',
                }}
              />
            </button>
            <div className="min-w-0">
              <p className={`truncate text-sm font-semibold ${textClass}`}>Living Room Light</p>
              <p className="mt-0.5 truncate text-[10px] text-gray-300">Light</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className={`text-xs ${mutedClass}`}>Brightness</span>
            <span className={`text-sm font-bold ${textClass}`}>{brightness}%</span>
          </div>
          <div
            className={`relative h-2 rounded-full ${isLightTheme ? 'bg-gray-200' : 'bg-white/10'}`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${brightness}%`,
                background: `linear-gradient(to right, ${accentColor}aa, ${accentColor})`,
              }}
            />
            <div
              className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-white bg-white shadow-lg"
              style={{ left: `calc(${brightness}% - 12px)` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-1.5">
          {PRESET_LABELS.map((label, index) => (
            <button
              type="button"
              key={label}
              onClick={(event) => {
                event.stopPropagation();
                setBrightness(index === 0 ? 25 : index === 1 ? 60 : 100);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-medium transition-all hover:scale-105 active:scale-95 ${
                brightness === (index === 0 ? 25 : index === 1 ? 60 : 100)
                  ? 'text-white'
                  : quietPillClass
              }`}
              style={
                brightness === (index === 0 ? 25 : index === 1 ? 60 : 100)
                  ? { backgroundColor: accentColor }
                  : undefined
              }
            >
              {index === 2 ? <MoreHorizontal className="h-3.5 w-3.5" /> : label}
            </button>
          ))}
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 45%, rgba(255, 255, 255, 0.9) 100%)`,
              borderColor: `${accentColor}55`,
            }}
          >
            <Sun className="h-3.5 w-3.5 text-white" />
          </button>
          {showsTrailingButton && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showControlsOpenedToast();
              }}
              className={`ml-auto flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${quietPillClass} transition-all hover:scale-105 active:scale-95`}
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className={`rounded-2xl px-4 py-3 ${quietPillClass}`}>
          <div className="flex items-center gap-2 text-xs font-medium">
            <Hand className="h-3.5 w-3.5" />
            <span>Tap card</span>
          </div>
          <p className={`mt-1 text-sm ${textClass}`}>{preview.cardTap}</p>
        </div>

        <div className={`grid gap-3 ${showsTrailingButton ? 'sm:grid-cols-2' : 'sm:grid-cols-1'}`}>
          <div className={`rounded-2xl px-4 py-3 ${quietPillClass}`}>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em]">Icon</p>
            <p className={`mt-1 text-sm ${textClass}`}>{preview.iconTap}</p>
          </div>
          {showsTrailingButton && (
            <div className={`rounded-2xl px-4 py-3 ${quietPillClass}`}>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em]">Trailing button</p>
              <p className={`mt-1 text-sm ${textClass}`}>Open controls</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
