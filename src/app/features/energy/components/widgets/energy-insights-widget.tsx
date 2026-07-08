import { Gauge } from 'lucide-react';
import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import type { EnergyInsight } from '../../types/energy.types';
import { EnergyWidgetShell } from '../energy-widget-shell';

const SEVERITY_CLASS: Record<EnergyInsight['severity'], string> = {
  critical: 'text-rose-300',
  warning: 'text-amber-300',
  info: 'text-sky-300',
};

interface EnergyInsightsWidgetProps {
  insights: EnergyInsight[];
}

export const EnergyInsightsWidget = memo(function EnergyInsightsWidget({
  insights,
}: EnergyInsightsWidgetProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <EnergyWidgetShell
      title="Insights and anomalies"
      eyebrow="Attention needed"
      action={<Gauge className={`h-5 w-5 ${surface.textMuted}`} />}
    >
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-3xl border p-4 ${surface.border} ${surface.panelMuted}`}
          >
            <div
              className={`text-xs font-semibold uppercase tracking-[0.16em] ${SEVERITY_CLASS[insight.severity]}`}
            >
              {insight.severity}
            </div>
            <div className={`mt-2 text-sm font-semibold ${surface.textPrimary}`}>
              {insight.title}
            </div>
            <p className={`mt-2 text-sm leading-6 ${surface.textSecondary}`}>
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </EnergyWidgetShell>
  );
});
