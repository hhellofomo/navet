import { MapPin } from 'lucide-react';
import { BatteryIndicator } from './battery-indicator';
import { getVacuumStatusColorClass, getVacuumStatusText, type VacuumStatus } from './vacuum-utils';

interface VacuumStatusDisplayProps {
  currentStatus: VacuumStatus;
  battery: number;
  cleanedArea: string;
  cleaningTime: string;
  room: string;
  theme: 'light' | 'dark' | 'contrast';
  isSmall: boolean;
}

export function VacuumStatusDisplay({
  currentStatus,
  battery,
  cleanedArea,
  cleaningTime,
  room,
  theme,
  isSmall,
}: VacuumStatusDisplayProps) {
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-gray-300';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-xs ${textSecondary} flex items-center gap-1`}>
            <MapPin className="w-3 h-3" />
            {room}
          </div>
          <div className={`font-medium ${getVacuumStatusColorClass(currentStatus)}`}>
            {getVacuumStatusText(currentStatus)}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xs ${textSecondary}`}>Battery</div>
          <div className={`font-medium ${textPrimary}`}>{battery}%</div>
        </div>
      </div>

      <BatteryIndicator battery={battery} theme={theme} />

      {!isSmall && (
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <div className={`text-xs ${textSecondary}`}>Cleaned Area</div>
            <div className={`font-medium ${textPrimary}`}>{cleanedArea}</div>
          </div>
          <div>
            <div className={`text-xs ${textSecondary}`}>Cleaning Time</div>
            <div className={`font-medium ${textPrimary}`}>{cleaningTime}</div>
          </div>
        </div>
      )}
    </div>
  );
}
