import { Gauge, TrendingDown, TrendingUp } from 'lucide-react';
import { memo } from 'react';
import {
  type CardSize,
  CardSizeSelector,
  isCompactCardSize,
} from '@/app/components/shared/card-size-selector';
import { EntityCardHeader } from '@/app/components/shared/entity-card-header';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { getAccentCardShellTokens } from '@/app/components/shared/theme/accent-card-shell-tokens';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n, useTheme } from '@/app/hooks';

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
  const { t } = useI18n();
  const surface = getThemeSurfaceTokens(theme);
  const isGlass = theme === 'glass';
  const shell = getAccentCardShellTokens(theme, 'teal');

  // Size-specific styling
  const isSmall = isCompactCardSize(size);
  const padding = isSmall ? 'p-4' : 'p-5';

  const IconComponent =
    icon === 'trend-up' ? TrendingUp : icon === 'trend-down' ? TrendingDown : Gauge;

  // Theme-aware colors
  const textPrimary = surface.textPrimary;
  const textSecondary = surface.textSubtle;
  const accentColor =
    theme === 'light' ? 'text-teal-700' : isGlass ? 'text-teal-200' : 'text-teal-400';
  return (
    <div
      className={`relative h-full backdrop-blur-xl rounded-3xl ${padding} border overflow-hidden ${shell.containerClassName}`}
    >
      {isEditMode && (
        <CardSizeSelector
          currentSize={size}
          onSizeChange={(newSize) => onSizeChange(cardId, newSize)}
        />
      )}

      <div className={`absolute inset-0 ${shell.glowClassName}`}></div>

      {shell.overlayClassName && <div className={`absolute inset-0 ${shell.overlayClassName}`} />}

      <div className="relative h-full flex flex-col">
        <EntityCardHeader
          title={name}
          subtitle={t('sensors.single')}
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
