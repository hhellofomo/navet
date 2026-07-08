import { Gauge, TrendingDown, TrendingUp } from 'lucide-react';
import { memo } from 'react';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { useTheme } from '@/app/contexts/theme-context';

interface SensorCardProps {
  name: string;
  room: string;
  value: string;
  unit: string;
  icon?: 'gauge' | 'trend-up' | 'trend-down';
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

export const SensorCard = memo(function SensorCard({
  name,
  room,
  value,
  unit,
  icon = 'gauge',
  size,
  onSizeChange,
  isEditMode,
}: SensorCardProps) {
  const cardId = `sensor-${name.toLowerCase().replace(/ /g, '-')}`;
  const { theme } = useTheme();

  // Size-specific styling
  const isSmall = size === 'extra-small' || size === 'small';
  const padding = isSmall ? 'p-4' : 'p-5';

  const IconComponent =
    icon === 'trend-up' ? TrendingUp : icon === 'trend-down' ? TrendingDown : Gauge;

  // Theme-aware colors
  const cardGradient =
    theme === 'light' ? 'from-white to-teal-50/80' : 'from-teal-900/90 to-teal-950/95';
  const cardBorder = theme === 'light' ? 'border-gray-200/80' : 'border-teal-700/30';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-gray-300';
  const iconBg = theme === 'light' ? 'bg-teal-100' : 'bg-teal-500/20';
  const iconColor = theme === 'light' ? 'text-teal-600' : 'text-teal-400';
  const accentColor = theme === 'light' ? 'text-teal-700' : 'text-teal-400';
  const glowGradient = theme === 'light' ? 'from-teal-50/40' : 'from-teal-500/5';

  return (
    <div
      className={`relative h-full bg-gradient-to-br ${cardGradient} backdrop-blur-xl rounded-3xl ${padding} border ${cardBorder} overflow-hidden ${theme === 'light' ? 'shadow-lg' : ''}`}
    >
      {isEditMode && (
        <CardSizeSelector
          currentSize={size}
          onSizeChange={(newSize) => onSizeChange(cardId, newSize)}
        />
      )}

      <div className={`absolute inset-0 bg-gradient-to-br ${glowGradient} to-transparent`}></div>

      {/* Light theme frosted overlay */}
      {theme === 'light' && <div className="absolute inset-0 bg-white/60" />}

      <div className="relative h-full flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            <h3
              className={`font-semibold ${textPrimary} truncate ${isSmall ? 'text-xs' : 'text-sm'}`}
            >
              {name}
            </h3>
            <p className="text-[10px] text-gray-300 truncate mt-0.5">Sensor</p>
            {!isSmall && <p className={`text-xs ${textSecondary}`}>{room}</p>}
          </div>
          <div
            className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}
          >
            <IconComponent className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} ${iconColor}`} />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className={`${isSmall ? 'text-3xl' : 'text-4xl'} font-bold ${textPrimary}`}>
              {value}
              <span className={`${isSmall ? 'text-lg' : 'text-2xl'} ${accentColor} ml-1`}>
                {unit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
