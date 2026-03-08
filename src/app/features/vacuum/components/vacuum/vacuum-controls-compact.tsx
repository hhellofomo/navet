import { Home, Pause, Play, Settings2 } from 'lucide-react';
import type { VacuumStatus } from './vacuum-utils';

interface VacuumControlsCompactProps {
  currentStatus: VacuumStatus;
  onStartCleaning: () => void;
  onPause: () => void;
  onReturnHome: () => void;
  onOpenSettings: () => void;
  theme: 'light' | 'dark' | 'contrast';
}

export function VacuumControlsCompact({
  currentStatus,
  onStartCleaning,
  onPause,
  onReturnHome,
  onOpenSettings,
  theme,
}: VacuumControlsCompactProps) {
  const btnBg =
    theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/20';
  const btnText = theme === 'light' ? 'text-gray-700' : 'text-gray-300';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {currentStatus === 'cleaning' ? (
          <button
            type="button"
            onClick={onPause}
            className={`w-8 h-8 rounded-full ${btnBg} transition-colors flex items-center justify-center`}
          >
            <Pause className={`w-3.5 h-3.5 ${btnText}`} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onStartCleaning}
            className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <Play className="w-4 h-4 text-white" />
          </button>
        )}
        <button
          type="button"
          onClick={onReturnHome}
          className={`w-8 h-8 rounded-full ${btnBg} transition-colors flex items-center justify-center`}
        >
          <Home className={`w-3.5 h-3.5 ${btnText}`} />
        </button>
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpenSettings();
        }}
        className={`w-8 h-8 rounded-full ${btnBg} transition-all flex items-center justify-center`}
      >
        <Settings2 className={`w-3.5 h-3.5 ${btnText}`} />
      </button>
    </div>
  );
}
