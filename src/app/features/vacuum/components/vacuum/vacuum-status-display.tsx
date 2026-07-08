import { MapPin } from 'lucide-react';
import { BatteryIndicator } from './battery-indicator';

interface VacuumStatusDisplayProps {
  currentStatus: 'cleaning' | 'returning' | 'docked' | 'paused' | 'idle';
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
  const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-gray-400';

  const getStatusText = () => {
    switch (currentStatus) {
      case 'cleaning':
        return 'Cleaning';
      case 'returning':
        return 'Returning to dock';
      case 'docked':
        return 'Docked';
      case 'paused':
        return 'Paused';
      default:
        return 'Idle';
    }
  };

  const statusColors: Record<string, string> = {
    cleaning: 'text-blue-500',
    returning: 'text-amber-500',
    docked: 'text-green-500',
    paused: 'text-gray-500',
    idle: 'text-gray-500',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-xs ${textSecondary} flex items-center gap-1`}>
            <MapPin className="w-3 h-3" />
            {room}
          </div>
          <div className={`font-medium ${statusColors[currentStatus] || 'text-gray-500'}`}>
            {getStatusText()}
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
