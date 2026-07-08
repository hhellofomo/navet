import { useMemo } from 'react';
import { HEATING_CATEGORIES } from '../data/energy-constants';
import { getMockEnergyOverview } from '../data/mock-energy-dashboard';
import { useEnergyDashboardStore } from '../stores/energy-dashboard-store';

export function useEnergyDashboard() {
  const range = useEnergyDashboardStore((state) => state.range);
  const setRange = useEnergyDashboardStore((state) => state.setRange);
  const selectedNodeId = useEnergyDashboardStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useEnergyDashboardStore((state) => state.setSelectedNodeId);
  const visibleWidgets = useEnergyDashboardStore((state) => state.visibleWidgets);
  const toggleWidgetVisibility = useEnergyDashboardStore((state) => state.toggleWidgetVisibility);

  const overview = useMemo(() => getMockEnergyOverview(range), [range]);

  const selectedNode = useMemo(
    () => overview.nodes.find((node) => node.id === selectedNodeId) ?? overview.nodes[0] ?? null,
    [overview.nodes, selectedNodeId]
  );

  const heatingConsumers = useMemo(
    () => overview.topConsumers.filter((consumer) => HEATING_CATEGORIES.has(consumer.category)),
    [overview.topConsumers]
  );

  const visibleWidgetSet = useMemo(() => new Set(visibleWidgets), [visibleWidgets]);

  return {
    overview,
    range,
    setRange,
    selectedNode,
    setSelectedNodeId,
    visibleWidgetSet,
    toggleWidgetVisibility,
    heatingConsumers,
  };
}
