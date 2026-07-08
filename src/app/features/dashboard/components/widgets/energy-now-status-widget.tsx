import { Zap } from 'lucide-react';
import { BaseCard } from '@/app/components/primitives';
import { getCardStateSurfaceTokens } from '@/app/components/shared/theme/card-state-surface-tokens';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n, useTheme } from '@/app/hooks';

export function EnergyNowStatusWidget({ message }: { message: string }) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const surface = getThemeSurfaceTokens(theme);
  const stateSurface = getCardStateSurfaceTokens(theme, false);

  return (
    <BaseCard
      size="medium"
      fullBleed
      className="transition-all duration-500"
      contentClassName="h-full"
    >
      <div className="relative z-10 flex h-full flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div
              className={`text-xs font-semibold uppercase tracking-[0.16em] ${stateSurface.mutedTextClassName}`}
            >
              {t('energy.widgets.now.eyebrow')}
            </div>
            <div className={`mt-1 text-sm font-semibold ${stateSurface.primaryTextClassName}`}>
              {t('energy.widgets.now.title')}
            </div>
          </div>
          <Zap className={`h-4 w-4 ${stateSurface.mutedTextClassName}`} />
        </div>
        <div className={`relative z-10 text-sm ${surface.textSecondary}`}>{message}</div>
      </div>
    </BaseCard>
  );
}
