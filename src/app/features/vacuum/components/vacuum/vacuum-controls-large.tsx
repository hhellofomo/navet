import { Home, Pause, Play } from 'lucide-react';
import { CardActionRow } from '@/app/components/shared/card-action-row';
import { CardSettingsActionButton } from '@/app/components/shared/card-settings-action-button';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
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
  const surface = getThemeSurfaceTokens(theme);
  const btnClass = `${surface.subtleBg} ${surface.hoverBg}`;
  const btnText = theme === 'light' ? 'text-gray-700' : surface.textSecondary;

  return (
    <CardActionRow
      theme={theme}
      size="large"
      leftContent={
        <>
          {currentStatus === 'cleaning' ? (
            <button
              type="button"
              onClick={onPause}
              className={`h-10 w-10 rounded-full ${btnClass} transition-colors flex items-center justify-center`}
            >
              <Pause className={`h-5 w-5 ${btnText}`} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartCleaning}
              className="h-10 w-10 rounded-full transition-colors flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: accentColorValue,
                boxShadow: `0 10px 24px ${accentColorValue}55`,
              }}
            >
              <Play className="h-5 w-5 text-white" />
            </button>
          )}
          <button
            type="button"
            onClick={onReturnHome}
            className={`h-10 w-10 rounded-full ${btnClass} transition-colors flex items-center justify-center`}
          >
            <Home className={`h-5 w-5 ${btnText}`} />
          </button>
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
