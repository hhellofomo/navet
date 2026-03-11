import { Home, Pause, Play } from 'lucide-react';
import { CardActionRow } from '@/app/components/shared/card-action-row';
import { CardSettingsActionButton } from '@/app/components/shared/card-settings-action-button';
import { RoundControlButton } from '@/app/components/shared/round-control-button';
import type { ThemeType } from '@/app/hooks/use-theme';
import type { VacuumStatus } from './vacuum-utils';

interface VacuumControlsLargeProps {
  currentStatus: VacuumStatus;
  onStartCleaning: () => void;
  onPause: () => void;
  onReturnHome: () => void;
  onOpenSettings: () => void;
  theme: ThemeType;
  accentColorValue: string;
}

export function VacuumControlsLarge({
  currentStatus,
  onStartCleaning,
  onPause,
  onReturnHome,
  onOpenSettings,
  theme,
  accentColorValue,
}: VacuumControlsLargeProps) {
  return (
    <CardActionRow
      theme={theme}
      size="large"
      leftContent={
        <>
          {currentStatus === 'cleaning' ? (
            <RoundControlButton
              theme={theme}
              size="large"
              variant="neutral"
              onClick={onPause}
              className="transition-colors"
            >
              <Pause className="h-5 w-5" />
            </RoundControlButton>
          ) : (
            <RoundControlButton
              theme={theme}
              size="large"
              variant="emphasis"
              onClick={onStartCleaning}
              className="shadow-lg"
              style={{
                backgroundColor: accentColorValue,
                boxShadow: `0 10px 24px ${accentColorValue}55`,
              }}
            >
              <Play className="h-5 w-5 text-white" />
            </RoundControlButton>
          )}
          <RoundControlButton
            theme={theme}
            size="large"
            variant="neutral"
            onClick={onReturnHome}
            className="transition-colors"
          >
            <Home className="h-5 w-5" />
          </RoundControlButton>
        </>
      }
      rightContent={
        <CardSettingsActionButton
          theme={theme}
          size="large"
          onClick={(event) => {
            event.stopPropagation();
            onOpenSettings();
          }}
        />
      }
    />
  );
}
