import { Home, Pause, Play } from 'lucide-react';
import { CardActionRow } from '@/app/components/shared/card-action-row';
import { CardSettingsActionButton } from '@/app/components/shared/card-settings-action-button';
import { RoundControlButton } from '@/app/components/shared/round-control-button';
import type { ThemeType } from '@/app/hooks/use-theme';
import type { VacuumStatus } from './vacuum-utils';

interface VacuumControlsCompactProps {
  currentStatus: VacuumStatus;
  onStartCleaning: () => void;
  onPause: () => void;
  onReturnHome: () => void;
  onOpenSettings: () => void;
  theme: ThemeType;
  accentColorValue: string;
}

export function VacuumControlsCompact({
  currentStatus,
  onStartCleaning,
  onPause,
  onReturnHome,
  onOpenSettings,
  theme,
  accentColorValue,
}: VacuumControlsCompactProps) {
  return (
    <CardActionRow
      theme={theme}
      size="medium"
      leftContent={
        <>
          {currentStatus === 'cleaning' ? (
            <RoundControlButton
              theme={theme}
              size="medium"
              variant="neutral"
              onClick={onPause}
              className="transition-colors"
            >
              <Pause className="h-3.5 w-3.5" />
            </RoundControlButton>
          ) : (
            <RoundControlButton
              theme={theme}
              size="medium"
              variant="emphasis"
              onClick={onStartCleaning}
              className="shadow-lg"
              style={{
                backgroundColor: accentColorValue,
                boxShadow: `0 8px 18px ${accentColorValue}45`,
              }}
            >
              <Play className="h-3.5 w-3.5 text-white" />
            </RoundControlButton>
          )}
          <RoundControlButton
            theme={theme}
            size="medium"
            variant="neutral"
            onClick={onReturnHome}
            className="transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
          </RoundControlButton>
        </>
      }
      rightContent={
        <CardSettingsActionButton
          theme={theme}
          size="medium"
          onClick={(event) => {
            event.stopPropagation();
            onOpenSettings();
          }}
        />
      }
    />
  );
}
