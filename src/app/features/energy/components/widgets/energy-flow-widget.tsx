import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import { FLOW_TO_NODE_ID, FLOW_TONE_ACCENT } from '../../data/energy-constants';
import type { EnergyFlowDatum } from '../../types/energy.types';
import { EnergySparkline } from '../charts/energy-sparkline';
import { EnergyWidgetShell } from '../energy-widget-shell';

interface EnergyFlowWidgetProps {
  flow: EnergyFlowDatum[];
  onNodeSelect: (nodeId: string | null) => void;
}

export const EnergyFlowWidget = memo(function EnergyFlowWidget({
  flow,
  onNodeSelect,
}: EnergyFlowWidgetProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <EnergyWidgetShell title="Energy flow" eyebrow="Live balance">
      <div className="grid gap-3 lg:grid-cols-3">
        {flow.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNodeSelect(FLOW_TO_NODE_ID[item.id] ?? null)}
            className={`rounded-3xl border p-4 text-left transition-colors ${surface.border} ${surface.panelMuted} ${surface.hoverBg}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className={`text-xs uppercase tracking-[0.16em] ${surface.textMuted}`}>
                  {item.direction === 'sink'
                    ? 'Usage'
                    : item.direction === 'storage'
                      ? 'Storage'
                      : 'Supply'}
                </div>
                <div className={`mt-2 text-base font-semibold ${surface.textPrimary}`}>
                  {item.label}
                </div>
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${surface.border} ${surface.textSecondary}`}
              >
                {item.direction}
              </span>
            </div>

            <div className="mt-4">
              <EnergySparkline
                data={[
                  { value: item.value * 0.72 },
                  { value: item.value * 0.81 },
                  { value: item.value * 0.76 },
                  { value: item.value * 0.92 },
                  { value: item.value },
                ]}
                accentColor={FLOW_TONE_ACCENT[item.tone]}
                height={52}
              />
            </div>

            <div className={`mt-3 text-2xl font-semibold ${surface.textPrimary}`}>
              {item.value.toFixed(1)} kW
            </div>
            <div className={`mt-1 text-xs ${surface.textSecondary}`}>
              {item.direction === 'sink'
                ? 'Live demand from this branch'
                : item.direction === 'storage'
                  ? 'Buffer contribution right now'
                  : 'Active supply into the home'}
            </div>
          </button>
        ))}
      </div>
    </EnergyWidgetShell>
  );
});
