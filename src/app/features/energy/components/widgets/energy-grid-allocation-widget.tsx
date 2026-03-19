import { ChevronsRightLeft } from 'lucide-react';
import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import { EnergyWidgetShell } from '../energy-widget-shell';

interface GridAllocationItem {
  id: string;
  name: string;
  kWh: number;
  share: number;
}

interface EnergyGridAllocationWidgetProps {
  importTodayKWh: number;
  allocation: GridAllocationItem[];
}

export const EnergyGridAllocationWidget = memo(function EnergyGridAllocationWidget({
  importTodayKWh,
  allocation,
}: EnergyGridAllocationWidgetProps) {
  const { theme, accentColor } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <EnergyWidgetShell
      title="Grid energy to devices"
      eyebrow="Estimated allocation"
      action={<ChevronsRightLeft className={`h-4 w-4 ${surface.textMuted}`} />}
    >
      <div
        className={`mb-4 flex items-center justify-between gap-4 rounded-3xl border px-4 py-3 ${surface.border} ${surface.panelMuted}`}
      >
        <div>
          <div className={`text-xs uppercase tracking-[0.16em] ${surface.textMuted}`}>
            Allocation basis
          </div>
          <div className={`mt-1 text-sm ${surface.textSecondary}`}>
            Estimated from each device's share of monitored daily energy
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-semibold ${surface.textPrimary}`}>
            {importTodayKWh.toFixed(1)} kWh
          </div>
          <div className={`mt-1 text-xs ${surface.textMuted}`}>grid import today</div>
        </div>
      </div>

      <div className="space-y-3">
        {allocation.length === 0 ? (
          <div className={`rounded-3xl border p-4 text-sm ${surface.border} ${surface.textMuted}`}>
            No allocation data yet. Add daily kWh sensors for individual devices and a grid import
            energy sensor.
          </div>
        ) : (
          allocation.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl border p-4 ${surface.border} ${surface.panelMuted}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className={`truncate text-sm font-semibold ${surface.textPrimary}`}>
                    {item.name}
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/8">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${Math.max(6, item.share * 100)}%`,
                        background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${surface.textPrimary}`}>
                    {item.kWh.toFixed(2)} kWh
                  </div>
                  <div className={`mt-1 text-xs ${surface.textMuted}`}>
                    {(item.share * 100).toFixed(0)}%
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
