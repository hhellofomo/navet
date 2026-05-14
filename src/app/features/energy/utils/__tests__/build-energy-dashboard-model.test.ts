import { describe, expect, it } from 'vitest';
import { getMockEnergyOverview } from '../../data/mock-energy-dashboard';
import {
  buildEnergyDashboardModel,
  getEnergyModeSummary,
  normalizeEnergyRange,
  shouldUseStaticEnergyBeams,
} from '../build-energy-dashboard-model';
import {
  formatEnergyNodeValue,
  formatEnergyPercent,
  formatEnergyValue,
} from '../energy-formatters';

describe('buildEnergyDashboardModel', () => {
  it('maps legacy ranges to current range ids', () => {
    expect(normalizeEnergyRange('live')).toBe('now');
    expect(normalizeEnergyRange('day')).toBe('today');
    expect(normalizeEnergyRange('week')).toBe('week');
  });

  it('derives export flow when the house is pushing back to the grid', () => {
    const overview = getMockEnergyOverview('today');
    overview.totals.importW = 0;
    overview.totals.exportW = 2600;
    overview.totals.exportTodayKWh = 11.4;

    const dashboard = buildEnergyDashboardModel({
      overview,
      range: 'today',
      trend: overview.trend,
      periodTotals: { today: 22.4, week: 154.1, month: 611.7 },
      sourceConfig: {
        solarPowerEntityId: 'sensor.solar_power',
        gridExportPowerEntityId: 'sensor.grid_export_power',
        gridImportPowerEntityId: 'sensor.grid_import_power',
        devices: [],
      },
    });

    expect(dashboard.flows.some((flow) => flow.id === 'home-grid' && flow.to === 'grid')).toBe(
      true
    );
  });

  it('keeps solar visible as idle when configured but not producing', () => {
    const overview = getMockEnergyOverview('today');
    overview.totals.solarW = 0;
    overview.totals.solarTodayKWh = 0;

    const dashboard = buildEnergyDashboardModel({
      overview,
      range: 'today',
      trend: overview.trend,
      periodTotals: { today: 14.2, week: 102.3, month: 441.2 },
      sourceConfig: {
        solarPowerEntityId: 'sensor.solar_power',
        devices: [],
      },
    });

    expect(dashboard.nodes.find((node) => node.id === 'solar')?.status).toBe('idle');
  });

  it('returns peak mode summary for heavy grid import', () => {
    const overview = getMockEnergyOverview('today');
    overview.totals.importW = 2200;

    const dashboard = buildEnergyDashboardModel({
      overview,
      range: 'today',
      trend: overview.trend,
      periodTotals: { today: 24.8, week: 166.5, month: 707.2 },
      sourceConfig: { gridImportPowerEntityId: 'sensor.grid_import_power', devices: [] },
    });

    expect(dashboard.mode).toBe('peak');
    expect(
      getEnergyModeSummary(dashboard.mode, overview, dashboard.totals.renewableSharePct)
    ).toContain('Grid import');
  });

  it('does not expose instantaneous battery power as a today energy metric', () => {
    const overview = getMockEnergyOverview('today');
    overview.totals.batteryPowerW = -1450;

    const dashboard = buildEnergyDashboardModel({
      overview,
      range: 'today',
      trend: overview.trend,
      periodTotals: { today: 24.8, week: 166.5, month: 707.2 },
      sourceConfig: {
        batterySocEntityId: 'sensor.battery_soc',
        batteryPowerEntityId: 'sensor.battery_power',
        devices: [],
      },
    });

    const batteryNode = dashboard.nodes.find((node) => node.id === 'battery');
    expect(batteryNode).toBeDefined();
    expect(batteryNode?.todayValue).toBeUndefined();
    expect(batteryNode?.todayUnit).toBeUndefined();
  });

  it('keeps mode summaries stable for normal, eco, and peak modes', () => {
    const normalOverview = getMockEnergyOverview('today');
    normalOverview.totals.importW = 700;
    normalOverview.totals.solarW = 1200;
    normalOverview.totals.currentLoadW = 4200;

    const ecoOverview = getMockEnergyOverview('today');
    ecoOverview.totals.importW = 300;
    ecoOverview.totals.solarW = 3600;
    ecoOverview.totals.currentLoadW = 4200;

    const peakOverview = getMockEnergyOverview('today');
    peakOverview.totals.importW = 2400;

    const normalDashboard = buildEnergyDashboardModel({
      overview: normalOverview,
      range: 'today',
      trend: normalOverview.trend,
      periodTotals: { today: 24.8, week: 166.5, month: 707.2 },
      sourceConfig: { devices: [] },
    });
    const ecoDashboard = buildEnergyDashboardModel({
      overview: ecoOverview,
      range: 'today',
      trend: ecoOverview.trend,
      periodTotals: { today: 24.8, week: 166.5, month: 707.2 },
      sourceConfig: { solarPowerEntityId: 'sensor.solar_power', devices: [] },
    });
    const peakDashboard = buildEnergyDashboardModel({
      overview: peakOverview,
      range: 'today',
      trend: peakOverview.trend,
      periodTotals: { today: 24.8, week: 166.5, month: 707.2 },
      sourceConfig: { gridImportPowerEntityId: 'sensor.grid_import_power', devices: [] },
    });

    expect(normalDashboard.mode).toBe('normal');
    expect(
      getEnergyModeSummary(
        normalDashboard.mode,
        normalOverview,
        normalDashboard.totals.renewableSharePct
      )
    ).toBe('The home is balanced between local generation, storage, and grid supply.');

    expect(ecoDashboard.mode).toBe('eco');
    expect(
      getEnergyModeSummary(ecoDashboard.mode, ecoOverview, ecoDashboard.totals.renewableSharePct)
    ).toContain("today's supply");

    expect(peakDashboard.mode).toBe('peak');
    expect(
      getEnergyModeSummary(peakDashboard.mode, peakOverview, peakDashboard.totals.renewableSharePct)
    ).toContain('Grid import');
  });
});

describe('shouldUseStaticEnergyBeams', () => {
  it('uses static beams for reduced motion and low power settings', () => {
    expect(
      shouldUseStaticEnergyBeams({
        disableAnimations: false,
        lowPowerMode: false,
        effectsQuality: 'high',
        prefersReducedMotion: false,
      })
    ).toBe(false);

    expect(
      shouldUseStaticEnergyBeams({
        disableAnimations: false,
        lowPowerMode: true,
        effectsQuality: 'high',
        prefersReducedMotion: false,
      })
    ).toBe(true);
  });
});

describe('energy formatters', () => {
  it('formats energy values with consistent precision by purpose', () => {
    expect(formatEnergyValue(1.24)).toBe('1.2');
    expect(formatEnergyValue(1.25)).toBe('1.3');
    expect(formatEnergyPercent(42.6)).toBe('43');
    expect(formatEnergyNodeValue(99.4, '%')).toBe('99');
    expect(formatEnergyNodeValue(2.04, 'kW')).toBe('2.0');
  });
});
