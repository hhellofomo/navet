import { Gauge, TrendingDown, TrendingUp } from 'lucide-react';
import { memo } from 'react';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { EntityCardHeader } from '@/app/components/shared/entity-card-header';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { useTheme } from '@/app/hooks';

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
        <EntityCardHeader
          title={name}
          subtitle="Sensor"
          size={size}
          leading={
            <EntityCardHeaderIcon IconComponent={IconComponent} isActive={true} size={size} />
          }
        />

        {!isSmall && <p className={`mb-2 text-xs ${textSecondary}`}>{room}</p>}

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
