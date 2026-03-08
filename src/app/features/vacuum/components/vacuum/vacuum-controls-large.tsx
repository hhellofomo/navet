import { Home, Pause, Play } from 'lucide-react';
import { CardActionRow } from '@/app/components/shared/card-action-row';
import { CardSettingsActionButton } from '@/app/components/shared/card-settings-action-button';
import type { VacuumStatus } from './vacuum-utils';

interface VacuumControlsLargeProps {
  currentStatus: VacuumStatus;
  onStartCleaning: () => void;
  onPause: () => void;
  onReturnHome: () => void;
  onOpenSettings: () => void;
  theme: 'light' | 'dark' | 'contrast';
}

export function VacuumControlsLarge({
  currentStatus,
  onStartCleaning,
  onPause,
  onReturnHome,
  onOpenSettings,
  theme,
}: VacuumControlsLargeProps) {
  const btnBg =
    theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/20';
  const btnText = theme === 'light' ? 'text-gray-700' : 'text-gray-300';

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
              className={`h-10 w-10 rounded-full ${btnBg} transition-colors flex items-center justify-center`}
            >
              <Pause className={`h-5 w-5 ${btnText}`} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartCleaning}
              className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <Play className="h-6 w-6 text-white" />
            </button>
          )}
          <button
            type="button"
            onClick={onReturnHome}
            className={`h-10 w-10 rounded-full ${btnBg} transition-colors flex items-center justify-center`}
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
