import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import { FLOW_TO_NODE_ID, FLOW_TONE_GRADIENT } from '../../data/energy-constants';
import type { EnergyFlowDatum } from '../../types/energy.types';
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
            <div className="mt-4 h-2 rounded-full bg-white/8">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${Math.min(100, item.value * 10)}%`,
                  background: FLOW_TONE_GRADIENT[item.tone],
                }}
              />
            </div>
            <div className={`mt-3 text-2xl font-semibold ${surface.textPrimary}`}>
              {item.value.toFixed(1)} kW
            </div>
          </button>
        ))}
      </div>
    </EnergyWidgetShell>
  );
});
