import { memo } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';

interface DashboardCardSkeletonProps {
  size: CardSize;
}

export const DashboardCardSkeleton = memo(function DashboardCardSkeleton({
  size,
}: DashboardCardSkeletonProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const padding = size === 'extra-small' ? 'p-3' : isLarge ? 'p-5' : 'p-4';

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-3xl border backdrop-blur-xl ${padding} ${surface.panel} ${surface.border}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-transparent" />
      <div className="relative flex h-full flex-col animate-pulse">
        <div className="flex items-start gap-3">
          <div
            className={`rounded-full ${surface.subtleBg} ${isLarge ? 'h-11 w-11' : 'h-9 w-9'}`}
          />
          <div className="min-w-0 flex-1 space-y-2 pt-1">
            <div className={`h-3 rounded-full ${surface.subtleBg} w-2/3`} />
            <div className={`h-2 rounded-full ${surface.subtleBg} w-1/3`} />
          </div>
        </div>

        <div className="flex-1" />

        <div className="space-y-2">
          <div className={`h-2.5 rounded-full ${surface.subtleBg} w-full`} />
          {(isMedium || isLarge) && (
            <div className={`h-2.5 rounded-full ${surface.subtleBg} w-4/5`} />
          )}
          {isLarge ? (
            <div className="flex gap-2 pt-2">
              <div className={`h-8 flex-1 rounded-2xl ${surface.subtleBg}`} />
              <div className={`h-8 flex-1 rounded-2xl ${surface.subtleBg}`} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});
