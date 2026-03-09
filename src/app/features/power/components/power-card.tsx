import { TrendingDown, Zap } from 'lucide-react';
import { memo } from 'react';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';

interface PowerCardProps {
  percentage: number;
  usage: string;
  cost: string;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

export const PowerCard = memo(function PowerCard({
  percentage,
  usage,
  cost,
  size,
  onSizeChange,
  isEditMode,
}: PowerCardProps) {
  const cardId = 'power-1';
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const isGlass = theme === 'glass';

  // Size-specific styling with intelligent layout adaptation
  const isSmall = size === 'extra-small' || size === 'small';
  const isMedium = size === 'medium';
  const padding = isSmall ? 'p-4' : 'p-5';

  // Samsung-style energy comparison data
  const lastMonthCost = '3.10';
  const savedAmount = (parseFloat(lastMonthCost) - parseFloat(cost)).toFixed(2);
  const lastMonthUsage = '3.1 kW';
  const usageFloat = parseFloat(usage);
  const lastMonthUsageFloat = parseFloat(lastMonthUsage);
  const usageDiff = (lastMonthUsageFloat - usageFloat).toFixed(1);

  // Theme-aware colors
  const cardGradient =
    theme === 'light'
      ? 'from-white to-yellow-50/80'
      : isGlass
        ? 'from-white/16 via-yellow-200/10 to-white/[0.03]'
        : 'from-yellow-900/90 to-yellow-950/95';
  const cardBorder = theme === 'light' ? 'border-gray-200/80' : isGlass ? surface.border : 'border-yellow-700/30';
  const textPrimary = surface.textPrimary;
  const textSecondary = theme === 'light' ? 'text-gray-500' : surface.textSecondary;
  const iconBg = theme === 'light' ? 'bg-cyan-100' : isGlass ? 'bg-cyan-300/24 border border-cyan-100/20' : 'bg-cyan-500/24 border border-cyan-300/18';
  const iconColor = theme === 'light' ? 'text-cyan-700' : isGlass ? 'text-cyan-100' : 'text-cyan-300';
  const accentColor = theme === 'light' ? 'text-cyan-700' : isGlass ? 'text-cyan-200' : 'text-cyan-400';
  const glowGradient = theme === 'light' ? 'from-yellow-50/40' : isGlass ? 'from-white/10 via-cyan-300/10' : 'from-blue-500/5';
  const progressBg = theme === 'light' ? 'bg-gray-200' : isGlass ? 'bg-white/12' : 'bg-white/10';
  const savingBg = theme === 'light' ? 'bg-green-100' : isGlass ? 'bg-green-300/16' : 'bg-green-500/20';
  const savingText = theme === 'light' ? 'text-green-700' : isGlass ? 'text-green-200' : 'text-green-400';
  const infoBg = theme === 'light' ? 'bg-gray-100' : isGlass ? 'bg-white/8' : 'bg-white/5';

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
      {(theme === 'light' || isGlass) && (
        <div className={`absolute inset-0 ${theme === 'light' ? 'bg-white/60' : 'bg-white/[0.03]'}`} />
      )}

      <div className="relative h-full flex flex-col">
        <div className={`flex items-start justify-between ${isSmall ? 'mb-1' : 'mb-2'}`}>
          <div className="min-w-0 flex-1">
            <h3
              className={`font-semibold ${textPrimary} truncate ${isSmall ? 'text-xs' : 'text-sm'}`}
            >
              Energy Usage
            </h3>
            <p className={`text-[10px] ${surface.textMuted} truncate mt-0.5`}>Power</p>
          </div>
          <div
            className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}
          >
            <Zap className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} ${iconColor}`} />
          </div>
        </div>

        {isSmall ? (
          // Small: Just percentage
          <div className="flex-1 flex items-center justify-center">
            <div className={`text-3xl font-bold ${textPrimary} leading-none`}>{percentage}%</div>
          </div>
        ) : isMedium ? (
          // Medium: Compact layout with savings badge
          <>
            <div className="flex-1 flex flex-col justify-center gap-2">
              <div className="flex items-baseline gap-2">
                <div className={`text-3xl font-bold ${textPrimary} leading-none`}>${cost}</div>
                <div className={`flex items-center gap-1 px-2 py-0.5 ${savingBg} rounded-full`}>
                  <TrendingDown className={`w-3 h-3 ${savingText}`} />
                  <span className={`text-[10px] ${savingText} font-medium`}>
                    Saving ${savedAmount}
                  </span>
                </div>
              </div>
              <div className={`w-full h-2 ${progressBg} rounded-full overflow-hidden`}>
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <div className={`flex justify-between text-[10px] mt-2 ${textSecondary}`}>
              <span>{usage}</span>
              <span className={`${accentColor} font-semibold`}>{percentage}%</span>
            </div>
          </>
        ) : (
          // Large: Full display with detailed info
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-3">
              <div className="flex items-baseline gap-2 mb-1">
                <div className={`text-3xl font-bold ${textPrimary}`}>${cost}</div>
                <div className={`flex items-center gap-1 px-2 py-1 ${savingBg} rounded-full`}>
                  <TrendingDown className={`w-3 h-3 ${savingText}`} />
                  <span className={`text-xs ${savingText} font-medium`}>Saving ${savedAmount}</span>
                </div>
              </div>
              <div className={`text-xs ${textSecondary}`}>
                Using {usageDiff} kW less than same period last month
              </div>
            </div>

            <div className={`w-full h-2 ${progressBg} rounded-full overflow-hidden mb-3`}>
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className={`grid grid-cols-2 gap-2 p-2 ${infoBg} rounded-lg`}>
              <div>
                <div className={`text-[10px] ${textSecondary}`}>Current usage</div>
                <div className={`text-xs font-semibold ${textPrimary}`}>{usage}</div>
              </div>
              <div>
                <div className={`text-[10px] ${textSecondary}`}>Last month</div>
                <div className={`text-xs font-semibold ${textSecondary}`}>${lastMonthCost}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
