interface BatteryIndicatorProps {
  battery: number;
  theme: 'light' | 'dark' | 'contrast';
}

export function BatteryIndicator({ battery, theme }: BatteryIndicatorProps) {
  const getBatteryColor = () => {
    if (battery > 60) return 'from-green-500 to-green-600';
    if (battery > 30) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getBatteryColor()} transition-all duration-300`}
            style={{ width: `${battery}%` }}
          />
        </div>
      </div>
      <span className={`text-xs font-medium ${textSecondary}`}>{battery}%</span>
    </div>
  );
}
