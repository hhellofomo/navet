import { MapPin } from 'lucide-react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';
import { BatteryIndicator } from './battery-indicator';
import { getVacuumStatusColorClass, getVacuumStatusText, type VacuumStatus } from './vacuum-utils';

interface VacuumStatusDisplayProps {
  currentStatus: VacuumStatus;
  battery: number;
  cleanedArea: string;
  cleaningTime: string;
  room: string;
  theme: ThemeType;
  isSmall: boolean;
  isMedium?: boolean;
}

export function VacuumStatusDisplay({
  currentStatus,
  battery,
  cleanedArea,
  cleaningTime,
  room,
  theme,
  isSmall,
  isMedium = false,
}: VacuumStatusDisplayProps) {
  const surface = getThemeSurfaceTokens(theme);
  const textPrimary = surface.textPrimary;
  const textSecondary = theme === 'light' ? 'text-gray-500' : surface.textSecondary;
  const statusRow = (
    <div className="flex items-end justify-between">
      <div className={`font-medium leading-none ${getVacuumStatusColorClass(currentStatus)}`}>
        {getVacuumStatusText(currentStatus)}
      </div>
      <div className={`flex items-center gap-1 text-xs ${textSecondary}`}>
        <MapPin className="w-3 h-3" />
        <span>{room}</span>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col ${isMedium ? '' : 'h-full'}`}>
      {isSmall ? (
        <div className="flex flex-1 flex-col justify-end gap-3">
          {statusRow}
          <BatteryIndicator battery={battery} theme={theme} />
        </div>
      ) : isMedium ? (
        <div className="flex flex-col gap-3 pt-2">
          {statusRow}
          <BatteryIndicator battery={battery} theme={theme} />
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-between pt-2">
          {statusRow}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className={`text-xs ${textSecondary}`}>Cleaned Area</div>
              <div className={`font-medium ${textPrimary}`}>{cleanedArea}</div>
            </div>
            <div>
              <div className={`text-xs ${textSecondary}`}>Cleaning Time</div>
              <div className={`font-medium ${textPrimary}`}>{cleaningTime}</div>
            </div>
          </div>
          <BatteryIndicator battery={battery} theme={theme} />
        </div>
      )}
    </div>
  );
}
