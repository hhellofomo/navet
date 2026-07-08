import { Wifi } from 'lucide-react';
import { memo } from 'react';
import {
  type CardSize,
  CardSizeSelector,
  isCompactCardSize,
} from '@/app/components/shared/card-size-selector';
import { getAccentCardShellTokens } from '@/app/components/shared/theme/accent-card-shell-tokens';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n, useTheme } from '@/app/hooks';

interface WifiCardProps {
  networkName: string;
  speed: number;
  uploadSpeed: string;
  downloadSpeed: string;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

export const WifiCard = memo(function WifiCard({
  networkName,
  speed,
  uploadSpeed,
  downloadSpeed,
  size,
  onSizeChange,
  isEditMode,
}: WifiCardProps) {
  const cardId = 'wifi-1';
  const { theme } = useTheme();
  const { t } = useI18n();
  const surface = getThemeSurfaceTokens(theme);
  const isGlass = theme === 'glass';
  const shell = getAccentCardShellTokens(theme, 'green');

  // Size-specific styling with intelligent layout adaptation
  const isSmall = isCompactCardSize(size);
  const isMedium = size === 'medium';
  const padding = isSmall ? 'p-4' : 'p-5';

  // Theme-aware colors
  const textPrimary = surface.textPrimary;
  const textSecondary = surface.textSubtle;
  const iconBg =
    theme === 'light'
      ? 'bg-green-100'
      : isGlass
        ? 'bg-green-300/24 border border-green-100/20'
        : 'bg-green-500/24 border border-green-300/18';
  const iconColor =
    theme === 'light' ? 'text-green-700' : isGlass ? 'text-green-100' : 'text-green-300';
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
        <div className={`flex items-start justify-between ${isSmall ? 'mb-1' : 'mb-2'}`}>
          <div className="min-w-0 flex-1">
            <h3
              className={`font-semibold ${textPrimary} truncate ${isSmall ? 'text-xs' : 'text-sm'}`}
            >
              {t('wifi.title')}
            </h3>
            <p className={`text-[10px] ${surface.textMuted} truncate mt-0.5`}>
              {t('wifi.subtitle')}
            </p>
            {!isSmall && <p className={`text-xs ${textSecondary} truncate`}>{networkName}</p>}
          </div>
          <div
            className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}
          >
            <Wifi className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} ${iconColor}`} />
          </div>
        </div>

        {isSmall ? (
          // Small: Just speed
          <div className="flex-1 flex items-center justify-center">
            <div className={`text-2xl font-bold ${textPrimary} leading-none`}>
              {speed}
              <span className="text-xs ml-1">Mbps</span>
            </div>
          </div>
        ) : isMedium ? (
          // Medium: Speed with compact stats
          <div className="flex-1 flex flex-col justify-center">
            <div className={`text-3xl font-bold ${textPrimary} mb-1`}>
              {speed} <span className="text-base">Mbps</span>
            </div>
            <div className={`flex gap-3 text-xs ${textSecondary}`}>
              <span>↑ {uploadSpeed} Mbps</span>
              <span>↓ {downloadSpeed}</span>
            </div>
          </div>
        ) : (
          // Large: Full display
          <div className="flex-1 flex flex-col justify-center">
            <div className={`text-3xl font-bold ${textPrimary} mb-1`}>{speed} Mbps</div>
            <div className="flex gap-4 text-xs mt-2">
              <div>
                <span className={textSecondary}>↑ {uploadSpeed} Mbps</span>
              </div>
              <div>
                <span className={textSecondary}>↓ {downloadSpeed}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
