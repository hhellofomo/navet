import { useMemo } from 'react';
import { useHomeAssistant } from '@/app/hooks';
import { homeAssistantSelectors } from '@/app/stores/selectors';
import { HEATING_CATEGORIES } from '../data/energy-constants';
import { getMockEnergyOverview } from '../data/mock-energy-dashboard';
import { useEnergyDashboardStore } from '../stores/energy-dashboard-store';
import type {
  EnergyConsumer,
  EnergyDeviceSource,
  EnergyFlowDatum,
  EnergyOverview,
  EnergyRange,
  EnergySourceConfig,
  EnergyStat,
} from '../types/energy.types';
import { useEnergyStatisticsToday } from './use-energy-statistics-today';

type EntityMap = Record<string, { state: string }>;

function parseW(state: string | undefined): number {
  const n = parseFloat(state ?? '');
  return Number.isFinite(n) ? n : 0;
}

function parsePct(state: string | undefined): number {
  const n = parseFloat(state ?? '');
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
}

function buildLiveStats(
  config: EnergySourceConfig,
  homeLoadW: number,
  solarW: number,
  batterySoc: number,
  gridImportW: number,
  gridExportW: number
): EnergyStat[] {
  return [
    { label: 'Home Load', value: `${(homeLoadW / 1000).toFixed(1)} kW`, tone: 'default' },
    ...(config.solarPowerEntityId
      ? [
          {
            label: 'Solar',
            value: `${(solarW / 1000).toFixed(1)} kW`,
            tone: (solarW > 0 ? 'good' : 'default') as EnergyStat['tone'],
          },
        ]
      : []),
    ...(config.batterySocEntityId
      ? [
          {
            label: 'Battery',
            value: `${batterySoc.toFixed(0)}%`,
            tone: (batterySoc > 30
              ? 'good'
              : batterySoc > 10
                ? 'warn'
                : 'critical') as EnergyStat['tone'],
          },
        ]
      : []),
    ...(config.gridImportPowerEntityId || config.gridExportPowerEntityId
      ? [
          {
            label: 'Grid',
            value:
              gridImportW > 0
                ? `${(gridImportW / 1000).toFixed(1)} kW import`
                : `${(gridExportW / 1000).toFixed(1)} kW export`,
            tone: (gridImportW > 0 ? 'warn' : 'good') as EnergyStat['tone'],
          },
        ]
      : []),
  ];
}

function buildFlow(
  solarW: number,
  batteryDischargeW: number,
  batteryChargeW: number,
  gridImportW: number,
  gridExportW: number,
  homeLoadW: number
): EnergyFlowDatum[] {
  const flow: EnergyFlowDatum[] = [];
  if (solarW > 0)
    flow.push({
      id: 'solar',
      label: 'Solar',
      value: +(solarW / 1000).toFixed(2),
      direction: 'source',
      tone: 'solar',
    });
  if (batteryDischargeW > 0)
    flow.push({
      id: 'battery',
      label: 'Battery Discharge',
      value: +(batteryDischargeW / 1000).toFixed(2),
      direction: 'storage',
      tone: 'battery',
    });
  if (batteryChargeW > 0)
    flow.push({
      id: 'battery-charge',
      label: 'Battery Charging',
      value: +(batteryChargeW / 1000).toFixed(2),
      direction: 'sink',
      tone: 'battery',
    });
  if (gridImportW > 0)
    flow.push({
      id: 'grid',
      label: 'Grid Import',
      value: +(gridImportW / 1000).toFixed(2),
      direction: 'source',
      tone: 'grid',
    });
  if (gridExportW > 0)
    flow.push({
      id: 'grid-export',
      label: 'Grid Export',
      value: +(gridExportW / 1000).toFixed(2),
      direction: 'source',
      tone: 'grid',
    });
  if (homeLoadW > 0)
    flow.push({
      id: 'home',
      label: 'Home Load',
      value: +(homeLoadW / 1000).toFixed(2),
      direction: 'sink',
      tone: 'load',
    });
  return flow;
}

function buildConsumers(
  devices: EnergyDeviceSource[],
  entities: EntityMap | null | undefined,
  todayKWh: Record<string, number>,
  homeLoadW: number
): EnergyConsumer[] {
  return devices
    .map((device) => {
      const powerW = parseW(entities?.[device.powerEntityId ?? '']?.state);
      // Prefer today's kWh from statistics; fall back to entity state (running total)
      const energyKWh = todayKWh[device.entityId] ?? parseW(entities?.[device.entityId]?.state);
      return {
        id: device.entityId,
        name: device.name,
        category: device.category,
        powerW,
        energyKWh,
        shareOfLoad: homeLoadW > 0 ? powerW / homeLoadW : 0,
        costToday: 0,
        status: (powerW > 10 ? 'active' : 'idle') as EnergyConsumer['status'],
      };
    })
    .sort((a, b) => b.energyKWh - a.energyKWh || b.powerW - a.powerW);
}

/**
 * Reads live HA entity states for each configured source and builds an
 * EnergyOverview. Falls back to mock data when sourceConfig is null so the
 * dashboard remains useful before the user connects their sensors.
 *
 * Trend data uses mock values — a follow-up will replace this with
 * recorder/statistics_during_period once the setup flow is validated.
 */
export function useEnergyHaData(range: EnergyRange): {
  overview: EnergyOverview;
  isConfigured: boolean;
} {
  const sourceConfig = useEnergyDashboardStore((s) => s.sourceConfig);
  const entities = useHomeAssistant(homeAssistantSelectors.entities);
  const todayKWh = useEnergyStatisticsToday(sourceConfig);

  const overview = useMemo((): EnergyOverview => {
    if (!sourceConfig) return getMockEnergyOverview(range);

    const solarW = parseW(entities?.[sourceConfig.solarPowerEntityId ?? '']?.state);
    const batterySoc = parsePct(entities?.[sourceConfig.batterySocEntityId ?? '']?.state);
    const batteryPowerRaw = parseW(entities?.[sourceConfig.batteryPowerEntityId ?? '']?.state);
    const gridImportW = parseW(entities?.[sourceConfig.gridImportPowerEntityId ?? '']?.state);
    const gridExportW = parseW(entities?.[sourceConfig.gridExportPowerEntityId ?? '']?.state);
    const homeLoadW = sourceConfig.homeLoadPowerEntityId
      ? parseW(entities?.[sourceConfig.homeLoadPowerEntityId]?.state)
      : Math.max(0, solarW + gridImportW - gridExportW);

    // batteryPowerRaw sign convention: positive = charging, negative = discharging
    const batteryDischargeW = batteryPowerRaw < 0 ? Math.abs(batteryPowerRaw) : 0;
    const batteryChargeW = batteryPowerRaw > 0 ? batteryPowerRaw : 0;

    return {
      liveStats: buildLiveStats(
        sourceConfig,
        homeLoadW,
        solarW,
        batterySoc,
        gridImportW,
        gridExportW
      ),
      flow: buildFlow(
        solarW,
        batteryDischargeW,
        batteryChargeW,
        gridImportW,
        gridExportW,
        homeLoadW
      ),
      trend: getMockEnergyOverview(range).trend, // replaced by statistics in follow-up
      topConsumers: buildConsumers(sourceConfig.devices, entities, todayKWh, homeLoadW),
      insights: [],
      totals: {
        currentLoadW: homeLoadW,
        solarW,
        batteryPercent: batterySoc,
        importW: gridImportW,
        exportW: gridExportW,
        importTodayKWh: sourceConfig.gridImportEnergyEntityId
          ? (todayKWh[sourceConfig.gridImportEnergyEntityId] ?? 0)
          : 0,
        solarTodayKWh: sourceConfig.solarEnergyEntityId
          ? (todayKWh[sourceConfig.solarEnergyEntityId] ?? 0)
          : 0,
        gasTodayKWh: 0,
        hotWaterTodayKWh: 0,
        costToday: 0,
        projectedMonthCost: 0,
      },
      nodes: sourceConfig.devices.map((device) => ({
        id: device.entityId,
        name: device.name,
        kind: 'consumer' as const,
        resourceType: HEATING_CATEGORIES.has(device.category)
          ? ('heating' as const)
          : ('electricity' as const),
        category: device.category,
        entityIds: [device.entityId, ...(device.powerEntityId ? [device.powerEntityId] : [])],
      })),
    };
  }, [sourceConfig, entities, range, todayKWh]);

  return { overview, isConfigured: sourceConfig !== null };
}
