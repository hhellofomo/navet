import type {
  EnergyConsumer,
  EnergyFlowDatum,
  EnergyInsight,
  EnergyNode,
  EnergyOverview,
  EnergyRange,
  EnergySeriesPoint,
  EnergyStat,
} from '../types/energy.types';

const nodes: EnergyNode[] = [
  {
    id: 'solar-array',
    name: 'Solar Array',
    kind: 'source',
    resourceType: 'solar',
    entityIds: ['sensor.solar_production_power'],
    system: 'roof',
  },
  {
    id: 'battery-pack',
    name: 'Battery Storage',
    kind: 'storage',
    resourceType: 'battery',
    entityIds: ['sensor.battery_soc', 'sensor.battery_power'],
    system: 'garage',
  },
  {
    id: 'grid-meter',
    name: 'Grid Meter',
    kind: 'meter',
    resourceType: 'electricity',
    entityIds: ['sensor.grid_import_power', 'sensor.grid_export_power'],
  },
  {
    id: 'hvac-main',
    name: 'HVAC',
    kind: 'consumer',
    resourceType: 'heating',
    category: 'hvac',
    entityIds: ['climate.main_floor'],
    room: 'Living Room',
  },
  {
    id: 'ev-charger',
    name: 'EV Charger',
    kind: 'consumer',
    resourceType: 'electricity',
    category: 'ev_charger',
    entityIds: ['switch.ev_charger'],
    room: 'Garage',
  },
  {
    id: 'water-heater',
    name: 'Water Heater',
    kind: 'consumer',
    resourceType: 'hot_water',
    category: 'water_heater',
    entityIds: ['switch.water_heater'],
    room: 'Utility',
  },
];

const consumers: EnergyConsumer[] = [
  {
    id: 'ev',
    name: 'EV Charging',
    category: 'ev_charger',
    powerW: 7200,
    energyKWh: 18.4,
    shareOfLoad: 0.31,
    costToday: 5.84,
    status: 'active',
    room: 'Garage',
  },
  {
    id: 'hvac',
    name: 'HVAC',
    category: 'hvac',
    powerW: 4100,
    energyKWh: 11.8,
    shareOfLoad: 0.2,
    costToday: 3.62,
    status: 'active',
    room: 'Whole house',
  },
  {
    id: 'water-heater',
    name: 'Water Heater',
    category: 'water_heater',
    powerW: 2900,
    energyKWh: 8.1,
    shareOfLoad: 0.14,
    costToday: 2.41,
    status: 'active',
    room: 'Utility',
  },
  {
    id: 'floor-heating',
    name: 'Floor Heating',
    category: 'floor_heating',
    powerW: 1800,
    energyKWh: 5.6,
    shareOfLoad: 0.1,
    costToday: 1.64,
    status: 'active',
    room: 'Bathroom',
  },
  {
    id: 'bathroom-heater',
    name: 'Bathroom Heater',
    category: 'bathroom_heater',
    powerW: 920,
    energyKWh: 2.3,
    shareOfLoad: 0.04,
    costToday: 0.68,
    status: 'idle',
    room: 'Bathroom',
  },
  {
    id: 'dishwasher',
    name: 'Dishwasher',
    category: 'dishwasher',
    powerW: 710,
    energyKWh: 1.9,
    shareOfLoad: 0.03,
    costToday: 0.56,
    status: 'idle',
    room: 'Kitchen',
  },
];

const trendByRange: Record<EnergyRange, EnergySeriesPoint[]> = {
  live: [
    { label: 'Now', value: 11.7, secondaryValue: 7.8 },
    { label: '+15m', value: 10.8, secondaryValue: 7.5 },
    { label: '+30m', value: 9.9, secondaryValue: 7.1 },
    { label: '+45m', value: 9.2, secondaryValue: 6.8 },
  ],
  day: [
    { label: '00', value: 2.4, secondaryValue: 0.1 },
    { label: '04', value: 2.1, secondaryValue: 0.2 },
    { label: '08', value: 4.5, secondaryValue: 2.9 },
    { label: '12', value: 7.8, secondaryValue: 6.4 },
    { label: '16', value: 10.4, secondaryValue: 7.2 },
    { label: '20', value: 9.3, secondaryValue: 1.3 },
  ],
  week: [
    { label: 'Mon', value: 42, secondaryValue: 28 },
    { label: 'Tue', value: 40, secondaryValue: 31 },
    { label: 'Wed', value: 39, secondaryValue: 26 },
    { label: 'Thu', value: 45, secondaryValue: 30 },
    { label: 'Fri', value: 48, secondaryValue: 29 },
    { label: 'Sat', value: 38, secondaryValue: 24 },
    { label: 'Sun', value: 36, secondaryValue: 21 },
  ],
  month: [
    { label: 'W1', value: 281, secondaryValue: 152 },
    { label: 'W2', value: 264, secondaryValue: 161 },
    { label: 'W3', value: 298, secondaryValue: 171 },
    { label: 'W4', value: 287, secondaryValue: 169 },
  ],
};

const flow: EnergyFlowDatum[] = [
  { id: 'solar', label: 'Solar', value: 7.8, direction: 'source', tone: 'solar' },
  { id: 'battery', label: 'Battery Discharge', value: 1.9, direction: 'storage', tone: 'battery' },
  { id: 'grid', label: 'Grid Import', value: 2.0, direction: 'source', tone: 'grid' },
  { id: 'heating', label: 'Heating & Water', value: 4.9, direction: 'sink', tone: 'heating' },
  { id: 'mobility', label: 'EV Charging', value: 3.1, direction: 'sink', tone: 'load' },
  { id: 'other', label: 'Other Loads', value: 3.7, direction: 'sink', tone: 'load' },
];

const insights: EnergyInsight[] = [
  {
    id: 'heater-overlap',
    severity: 'warning',
    title: 'Heating overlap detected',
    description:
      'Floor heating, bathroom heater, and HVAC are all active during the same tariff peak.',
    affectedNodeIds: ['hvac-main', 'water-heater'],
  },
  {
    id: 'ev-night-window',
    severity: 'info',
    title: 'EV can shift to cheaper window',
    description:
      'Moving the next charging session after 22:00 would reduce estimated daily cost by 18%.',
    affectedNodeIds: ['ev-charger'],
  },
  {
    id: 'baseload',
    severity: 'critical',
    title: 'Night baseload is elevated',
    description:
      'Base consumption stayed above 1.4 kW for 3 nights. Investigate standby loads or heating schedules.',
    affectedNodeIds: ['grid-meter'],
  },
];

const liveStats: EnergyStat[] = [
  { label: 'Home Load', value: '11.7 kW', tone: 'default' },
  { label: 'Solar', value: '7.8 kW', tone: 'good' },
  { label: 'Battery', value: '82%', tone: 'good' },
  { label: 'Grid', value: '2.0 kW import', tone: 'warn' },
  { label: 'Gas Today', value: '12.4 kWh', tone: 'default' },
  { label: 'Hot Water', value: '8.1 kWh', tone: 'warn' },
];

export function getMockEnergyOverview(range: EnergyRange): EnergyOverview {
  return {
    liveStats,
    flow,
    trend: trendByRange[range],
    topConsumers: consumers,
    insights,
    totals: {
      currentLoadW: 11700,
      solarW: 7800,
      batteryPercent: 82,
      importW: 2000,
      exportW: 0,
      importTodayKWh: 14.2,
      solarTodayKWh: 31.6,
      gasTodayKWh: 12.4,
      hotWaterTodayKWh: 8.1,
      costToday: 17.42,
      projectedMonthCost: 364,
    },
    nodes,
  };
}
