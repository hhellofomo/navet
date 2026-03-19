import { Bolt } from 'lucide-react';
import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import type { EnergySeriesPoint } from '../../types/energy.types';
import { EnergySparkline } from '../charts/energy-sparkline';
import { EnergyWidgetShell } from '../energy-widget-shell';

interface EnergyNowWidgetProps {
  currentLoadW: number;
  gridImportW: number;
  trend: EnergySeriesPoint[];
  accentColor: string;
}

export const EnergyNowWidget = memo(function EnergyNowWidget({
  currentLoadW,
  gridImportW,
  trend,
  accentColor,
}: EnergyNowWidgetProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <EnergyWidgetShell
      title="Energy in use now"
      eyebrow="Live load"
      action={<Bolt className={`h-4 w-4 ${surface.textMuted}`} />}
    >
      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <div className={`rounded-3xl border p-4 ${surface.border} ${surface.panelMuted}`}>
          <div className={`text-xs uppercase tracking-[0.16em] ${surface.textMuted}`}>
            Current draw
          </div>
          <div className={`mt-3 text-4xl font-semibold tracking-tight ${surface.textPrimary}`}>
            {(currentLoadW / 1000).toFixed(1)} kW
          </div>
          <div className={`mt-3 text-sm ${surface.textSecondary}`}>
            {gridImportW > 0
              ? `${(gridImportW / 1000).toFixed(1)} kW coming from the grid right now`
              : 'No active grid import right now'}
          </div>
        </div>

        <div className={`rounded-3xl border p-4 ${surface.border} ${surface.panelMuted}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className={`text-xs uppercase tracking-[0.16em] ${surface.textMuted}`}>
                5-minute sparkline
              </div>
              <div className={`mt-1 text-sm ${surface.textSecondary}`}>
                Rolling aggregated usage
              </div>
            </div>
            <div className={`text-xs ${surface.textMuted}`}>kW</div>
          </div>

          <div className="mt-4">
            <EnergySparkline
              data={trend.map((point) => ({ value: point.value }))}
              accentColor={accentColor}
              height={54}
            />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
            {trend
              .filter((_, index) => index % 3 === 0 || index === trend.length - 1)
              .map((point) => (
                <div key={point.label}>
                  <div className={`${surface.textMuted}`}>{point.label}</div>
                  <div className={`mt-1 font-medium ${surface.textPrimary}`}>
                    {point.value.toFixed(1)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </EnergyWidgetShell>
  );
});
