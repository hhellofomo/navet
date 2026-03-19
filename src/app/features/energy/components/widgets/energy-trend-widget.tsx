import { memo } from 'react';
import type { EnergySeriesPoint } from '../../types/energy.types';
import { EnergyAreaChart } from '../charts/energy-area-chart';
import { EnergyBarChart } from '../charts/energy-bar-chart';
import { EnergyWidgetShell } from '../energy-widget-shell';

interface EnergyTrendWidgetProps {
  trend: EnergySeriesPoint[];
  accentColor: string;
}

export const EnergyTrendWidget = memo(function EnergyTrendWidget({
  trend,
  accentColor,
}: EnergyTrendWidgetProps) {
  const barData = trend.map((p) => ({
    label: p.label,
    value: Math.round(p.value * 10) / 10,
    unit: '',
  }));

  const areaData = trend.map((p) => ({
    x: p.label,
    y: Math.round(((p.secondaryValue ?? 0) / Math.max(...trend.map((t) => t.value), 1)) * 100),
  }));

  return (
    <EnergyWidgetShell title="Trends over time" eyebrow="Usage vs solar">
      <div className="space-y-4">
        <EnergyBarChart data={barData} color={accentColor} />
        <EnergyAreaChart data={areaData} color="#22d3ee" yUnit="%" yTicks={[0, 25, 50, 75, 100]} />
      </div>
    </EnergyWidgetShell>
  );
});
