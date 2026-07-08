import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import type { EnergyConsumer } from '../../types/energy.types';
import { EnergyWidgetShell } from '../energy-widget-shell';

interface EnergyConsumersWidgetProps {
  consumers: EnergyConsumer[];
}

export const EnergyConsumersWidget = memo(function EnergyConsumersWidget({
  consumers,
}: EnergyConsumersWidgetProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <EnergyWidgetShell title="Top consumers" eyebrow="Action priority">
      {consumers.length === 0 ? (
        <p className={`text-sm ${surface.textMuted}`}>
          No individual devices configured. Add device monitors in your HA Energy settings, then
          re-run auto-detect.
        </p>
      ) : null}
      <div className="space-y-3">
        {consumers.slice(0, 5).map((consumer) => (
          <div
            key={consumer.id}
            className={`rounded-3xl border p-4 ${surface.border} ${surface.panelMuted}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className={`text-sm font-semibold ${surface.textPrimary}`}>
                  {consumer.name}
                </div>
                <div className={`mt-1 text-xs ${surface.textSecondary}`}>
                  {consumer.room} • {(consumer.shareOfLoad * 100).toFixed(0)}% of load
                </div>
              </div>
              <div className="text-right">
                {consumer.powerW > 0 ? (
                  <div className={`text-sm font-semibold ${surface.textPrimary}`}>
                    {(consumer.powerW / 1000).toFixed(1)} kW
                  </div>
                ) : null}
                {consumer.energyKWh > 0 ? (
                  <div
                    className={`text-sm font-semibold ${consumer.powerW > 0 ? surface.textSecondary : surface.textPrimary}`}
                  >
                    {consumer.energyKWh.toFixed(2)} kWh today
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </EnergyWidgetShell>
  );
});
