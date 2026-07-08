import { Flame } from 'lucide-react';
import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import type { EnergyConsumer } from '../../types/energy.types';
import { EnergyWidgetShell } from '../energy-widget-shell';

interface EnergyHeatingWidgetProps {
  consumers: EnergyConsumer[];
}

export const EnergyHeatingWidget = memo(function EnergyHeatingWidget({
  consumers,
}: EnergyHeatingWidgetProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <EnergyWidgetShell
      title="Heating and hot water"
      eyebrow="Thermal systems"
      action={<Flame className={`h-5 w-5 ${surface.textMuted}`} />}
    >
      <div className="space-y-3">
        {consumers.map((consumer) => (
          <div
            key={consumer.id}
            className={`rounded-3xl border p-4 ${surface.border} ${surface.panelMuted}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className={`text-sm font-semibold ${surface.textPrimary}`}>
                  {consumer.name}
                </div>
                <div className={`mt-1 text-xs ${surface.textSecondary}`}>
                  {consumer.energyKWh.toFixed(1)} kWh today
                </div>
              </div>
              <div className={`text-base font-semibold ${surface.textPrimary}`}>
                ${consumer.costToday.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </EnergyWidgetShell>
  );
});
