import { Home, Pause, Play } from 'lucide-react';
import type { CSSProperties } from 'react';
import { CardDialogChoicePill } from '@/app/components/patterns';
import { Button } from '@/app/components/primitives';
import { useI18n } from '@/app/hooks';

type CleaningMode = 'auto' | 'spot' | 'edge' | 'room';

interface VacuumCleaningControlsProps {
  cleaningMode: CleaningMode;
  onCleaningModeChange: (mode: CleaningMode) => void;
  fanSpeed: string;
  onFanSpeedChange: (speed: string) => void;
  fanSpeedOptions: string[];
  currentStatus: 'cleaning' | 'returning' | 'docked' | 'paused' | 'idle';
  onStartCleaning: () => void;
  onPauseCleaning?: () => void;
  onReturnHome: () => void;
  activePillStyle?: CSSProperties;
  softControlStyle?: CSSProperties;
  activeControlColor: string;
  theme: 'light' | 'dark' | 'glass' | 'black';
}

export function VacuumCleaningControls({
  cleaningMode,
  onCleaningModeChange,
  fanSpeed,
  onFanSpeedChange,
  fanSpeedOptions,
  currentStatus,
  onStartCleaning,
  onPauseCleaning,
  onReturnHome,
  activePillStyle,
  softControlStyle,
  activeControlColor,
  theme,
}: VacuumCleaningControlsProps) {
  const { t } = useI18n();

  const primaryActionLabel =
    currentStatus === 'cleaning' ? t('vacuum.action.pause') : t('vacuum.action.startCleaning');

  const handlePrimaryAction = () => {
    if (currentStatus === 'cleaning') {
      onPauseCleaning?.();
    } else {
      onStartCleaning();
    }
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <fieldset className="border-0 p-0">
          <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
            {t('vacuum.settings.profile')}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['auto', 'spot', 'edge', 'room'] as CleaningMode[]).map((mode) => (
              <CardDialogChoicePill
                key={mode}
                active={cleaningMode === mode}
                onClick={() => onCleaningModeChange(mode)}
                style={cleaningMode === mode ? activePillStyle : undefined}
              >
                {t(`vacuum.mode.${mode}`)}
              </CardDialogChoicePill>
            ))}
          </div>
        </fieldset>

        <fieldset className="border-0 p-0">
          <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
            {t('vacuum.settings.fanSpeed')}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {fanSpeedOptions.map((speed) => (
              <CardDialogChoicePill
                key={speed}
                active={fanSpeed === speed}
                onClick={() => onFanSpeedChange(speed)}
                style={fanSpeed === speed ? activePillStyle : undefined}
              >
                {speed}
              </CardDialogChoicePill>
            ))}
          </div>
        </fieldset>
      </div>

      <fieldset className="mt-6 border-0 p-0">
        <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
          {t('vacuum.settings.actions')}
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Button
            variant="primary"
            size="default"
            leading={
              currentStatus === 'cleaning' ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )
            }
            onClick={handlePrimaryAction}
            style={{ backgroundColor: activeControlColor }}
          >
            {primaryActionLabel}
          </Button>

          <Button
            variant="secondary"
            size="default"
            leading={<Home className="h-4 w-4" />}
            onClick={onReturnHome}
            className={theme !== 'light' ? 'border-white/10 bg-white/8 hover:bg-white/12' : ''}
            style={softControlStyle}
          >
            {t('vacuum.action.returnToDock')}
          </Button>
        </div>
      </fieldset>
    </>
  );
}
