import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import type { EnergyStat } from '../../types/energy.types';
import { EnergyWidgetShell } from '../energy-widget-shell';

interface EnergyStatusWidgetProps {
  liveStats: EnergyStat[];
}

export const EnergyStatusWidget = memo(function EnergyStatusWidget({
  liveStats,
}: EnergyStatusWidgetProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <EnergyWidgetShell title="Current state" eyebrow="Overview">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {liveStats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-3xl border p-4 ${surface.border} ${surface.panelMuted}`}
          >
            <div className={`text-xs uppercase tracking-[0.16em] ${surface.textMuted}`}>
              {stat.label}
            </div>
            <div className={`mt-3 text-2xl font-semibold ${surface.textPrimary}`}>{stat.value}</div>
          </div>
        ))}
      </div>
    </EnergyWidgetShell>
  );
});
