import { PlugZap } from 'lucide-react';
import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import type { EnergyConsumer } from '../../types/energy.types';
import { EnergyWidgetShell } from '../energy-widget-shell';

interface EnergyDeviceTotalsWidgetProps {
  consumers: EnergyConsumer[];
}

export const EnergyDeviceTotalsWidget = memo(function EnergyDeviceTotalsWidget({
  consumers,
}: EnergyDeviceTotalsWidgetProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <EnergyWidgetShell
      title="Individual device totals"
      eyebrow="Today"
      action={<PlugZap className={`h-4 w-4 ${surface.textMuted}`} />}
    >
      <div className="space-y-3">
        {consumers.length === 0 ? (
          <div className={`rounded-3xl border p-4 text-sm ${surface.border} ${surface.textMuted}`}>
            No device totals available yet. Add kWh sensors for the devices you want to rank.
          </div>
        ) : (
          consumers.map((consumer, index) => (
            <div
              key={consumer.id}
              className={`rounded-3xl border p-4 ${surface.border} ${surface.panelMuted}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${surface.textMuted}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className={`truncate text-sm font-semibold ${surface.textPrimary}`}>
                      {consumer.name}
                    </div>
                  </div>
                  <div className={`mt-1 pl-8 text-xs ${surface.textSecondary}`}>
                    {consumer.room ?? 'Unassigned room'}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${surface.textPrimary}`}>
                    {consumer.energyKWh.toFixed(2)} kWh
                  </div>
                  <div className={`mt-1 text-xs ${surface.textMuted}`}>
                    {(consumer.powerW / 1000).toFixed(1)} kW now
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </EnergyWidgetShell>
  );
});
