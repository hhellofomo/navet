import { Zap } from 'lucide-react';
import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import { EnergyGauge } from '../charts/energy-gauge';
import { EnergyQualityBar } from '../charts/energy-quality-bar';
import { EnergyWidgetShell } from '../energy-widget-shell';

interface EnergyStorageWidgetProps {
  batteryPercent: number;
  solarW: number;
  currentLoadW: number;
  importW: number;
  hasBattery?: boolean;
  hasSolar?: boolean;
}

export const EnergyStorageWidget = memo(function EnergyStorageWidget({
  batteryPercent,
  solarW,
  currentLoadW,
  importW,
  hasBattery = true,
  hasSolar = true,
}: EnergyStorageWidgetProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const solarCoverage = Math.round((solarW / Math.max(currentLoadW, 1)) * 100);
  // Grid dependency quality: 0% import = 100 quality, high import = low quality
  const gridQuality = Math.max(0, Math.round(100 - (importW / Math.max(currentLoadW, 1)) * 100));

  return (
    <EnergyWidgetShell title="Storage and solar" eyebrow="Resilience">
      <div className="grid gap-4">
        {hasBattery && (
          <div className={`rounded-3xl border p-4 ${surface.border} ${surface.panelMuted}`}>
            <div className={`text-xs uppercase tracking-[0.16em] ${surface.textMuted}`}>
              Battery reserve
            </div>
            <EnergyGauge
              value={batteryPercent}
              accentColor="#34d399"
              label={`${batteryPercent}%`}
              sublabel="charge"
            />
          </div>
        )}

        {hasSolar && (
          <div className={`rounded-3xl border p-4 ${surface.border} ${surface.panelMuted}`}>
            <div className={`text-xs uppercase tracking-[0.16em] ${surface.textMuted}`}>
              Solar coverage
            </div>
            <EnergyGauge
              value={solarCoverage}
              accentColor="#f59e0b"
              label={`${solarCoverage}%`}
              sublabel="of current load"
            />
          </div>
        )}

        <div className={`rounded-3xl border p-4 ${surface.border} ${surface.panelMuted}`}>
          <div className={`flex items-center justify-between gap-4`}>
            <div className={`text-xs uppercase tracking-[0.16em] ${surface.textMuted}`}>
              Grid dependency
            </div>
            <div
              className={`flex items-center gap-1.5 text-sm font-semibold ${surface.textPrimary}`}
            >
              <Zap className="h-3.5 w-3.5" />
              {(importW / 1000).toFixed(1)} kW import
            </div>
          </div>
          <div className="mt-3">
            <EnergyQualityBar
              value={gridQuality}
              badLabel="Grid heavy"
              goodLabel="Self-sufficient"
              accentColor="#34d399"
            />
          </div>
        </div>
      </div>
    </EnergyWidgetShell>
  );
});
