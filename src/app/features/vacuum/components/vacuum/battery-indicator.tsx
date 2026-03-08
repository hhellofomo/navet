import { getVacuumBatteryGradientClass } from './vacuum-utils';

interface BatteryIndicatorProps {
  battery: number;
  theme: 'light' | 'dark' | 'contrast';
}

export function BatteryIndicator({ battery, theme }: BatteryIndicatorProps) {
  const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-gray-300';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getVacuumBatteryGradientClass(battery)} transition-all duration-300`}
            style={{ width: `${battery}%` }}
          />
        </div>
      </div>
      <span className={`text-xs font-medium ${textSecondary}`}>{battery}%</span>
    </div>
  );
}
