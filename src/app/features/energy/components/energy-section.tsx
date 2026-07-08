import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import { useEnergyDashboard } from '../hooks/use-energy-dashboard';
import type { EnergyRange, EnergyWidgetId } from '../types/energy.types';
import { EnergyConsumersWidget } from './widgets/energy-consumers-widget';
import { EnergyCostWidget } from './widgets/energy-cost-widget';
import { EnergyDrilldownWidget } from './widgets/energy-drilldown-widget';
import { EnergyFlowWidget } from './widgets/energy-flow-widget';
import { EnergyHeatingWidget } from './widgets/energy-heating-widget';
import { EnergyInsightsWidget } from './widgets/energy-insights-widget';
import { EnergyStatusWidget } from './widgets/energy-status-widget';
import { EnergyStorageWidget } from './widgets/energy-storage-widget';
import { EnergyTrendWidget } from './widgets/energy-trend-widget';

const rangeOptions: EnergyRange[] = ['live', 'day', 'week', 'month'];

const widgetLabels: Record<EnergyWidgetId, string> = {
  status: 'Status',
  flow: 'Flow',
  consumers: 'Consumers',
  cost: 'Cost',
  trend: 'Trend',
  storage: 'Storage',
  heating: 'Heating',
  insights: 'Insights',
};

export const EnergySection = memo(function EnergySection() {
  const { theme, accentColor } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const {
    overview,
    range,
    setRange,
    selectedNode,
    setSelectedNodeId,
    visibleWidgetSet,
    toggleWidgetVisibility,
    heatingConsumers,
  } = useEnergyDashboard();

  return (
    <div className="flex flex-col gap-6">
      <section
        className={`rounded-[32px] border p-5 md:p-6 ${surface.border} ${surface.panel} ${surface.cardShadow}`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${surface.textMuted}`}
            >
              Energy Dashboard
            </div>
            <h1
              className={`mt-2 text-2xl font-semibold tracking-tight md:text-3xl ${surface.textPrimary}`}
            >
              Actionable household energy across solar, storage, grid, gas, hot water, and major
              loads.
            </h1>
            <p className={`mt-3 max-w-2xl text-sm leading-6 ${surface.textSecondary}`}>
              Current state, cost pressure, top consumers, and anomaly signals are separated from
              detailed drill-downs so the dashboard stays fast and extensible.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {rangeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRange(option)}
                className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  range === option
                    ? 'border-transparent text-white'
                    : `${surface.border} ${surface.textPrimary} ${surface.hoverBg}`
                }`}
                style={range === option ? { backgroundColor: accentColor } : undefined}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {Object.entries(widgetLabels).map(([widgetId, label]) => {
            const active = visibleWidgetSet.has(widgetId as EnergyWidgetId);
            return (
              <button
                key={widgetId}
                type="button"
                onClick={() => toggleWidgetVisibility(widgetId as EnergyWidgetId)}
                className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                  active
                    ? 'border-transparent text-white'
                    : `${surface.border} ${surface.textSecondary} ${surface.panelMuted}`
                }`}
                style={active ? { backgroundColor: `${accentColor}cc` } : undefined}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <div className="grid gap-6">
          {visibleWidgetSet.has('status') && <EnergyStatusWidget liveStats={overview.liveStats} />}
          {visibleWidgetSet.has('flow') && (
            <EnergyFlowWidget flow={overview.flow} onNodeSelect={setSelectedNodeId} />
          )}
          {visibleWidgetSet.has('trend') && (
            <EnergyTrendWidget trend={overview.trend} accentColor={accentColor} />
          )}
          <div className="grid gap-6 lg:grid-cols-2">
            {visibleWidgetSet.has('consumers') && (
              <EnergyConsumersWidget consumers={overview.topConsumers} />
            )}
            {visibleWidgetSet.has('cost') && (
              <EnergyCostWidget
                costToday={overview.totals.costToday}
                projectedMonthCost={overview.totals.projectedMonthCost}
              />
            )}
          </div>
        </div>

        <div className="grid gap-6">
          {visibleWidgetSet.has('storage') && (
            <EnergyStorageWidget
              batteryPercent={overview.totals.batteryPercent}
              solarW={overview.totals.solarW}
              currentLoadW={overview.totals.currentLoadW}
              importW={overview.totals.importW}
            />
          )}
          {visibleWidgetSet.has('heating') && <EnergyHeatingWidget consumers={heatingConsumers} />}
          {visibleWidgetSet.has('insights') && (
            <EnergyInsightsWidget insights={overview.insights} />
          )}
          <EnergyDrilldownWidget node={selectedNode} />
        </div>
      </div>
    </div>
  );
});
