export type EnergyRange = 'live' | 'day' | 'week' | 'month';

export type EnergyResourceType =
  | 'electricity'
  | 'solar'
  | 'battery'
  | 'grid_import'
  | 'grid_export'
  | 'gas'
  | 'hot_water'
  | 'heating';

export type EnergyConsumerCategory =
  | 'ev_charger'
  | 'water_heater'
  | 'toilet_heater'
  | 'bathroom_heater'
  | 'floor_heating'
  | 'hvac'
  | 'washer'
  | 'dryer'
  | 'dishwasher'
  | 'other';

export type EnergyWidgetId =
  | 'status'
  | 'flow'
  | 'consumers'
  | 'cost'
  | 'trend'
  | 'storage'
  | 'heating'
  | 'insights';

export interface EnergyNode {
  id: string;
  name: string;
  kind: 'source' | 'storage' | 'consumer' | 'meter' | 'derived';
  resourceType: EnergyResourceType;
  category?: EnergyConsumerCategory;
  entityIds: string[];
  room?: string;
  system?: string;
}

export interface EnergyStat {
  label: string;
  value: string;
  tone?: 'default' | 'good' | 'warn' | 'critical';
}

export interface EnergySeriesPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface EnergyFlowDatum {
  id: string;
  label: string;
  value: number;
  direction: 'source' | 'storage' | 'sink';
  tone: 'solar' | 'battery' | 'grid' | 'heating' | 'load';
}

export interface EnergyConsumer {
  id: string;
  name: string;
  category: EnergyConsumerCategory;
  powerW: number;
  energyKWh: number;
  shareOfLoad: number;
  costToday: number;
  status: 'active' | 'idle' | 'standby';
  room?: string;
}

export interface EnergyInsight {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affectedNodeIds: string[];
}

export interface EnergyOverview {
  liveStats: EnergyStat[];
  flow: EnergyFlowDatum[];
  trend: EnergySeriesPoint[];
  topConsumers: EnergyConsumer[];
  insights: EnergyInsight[];
  totals: {
    currentLoadW: number;
    solarW: number;
    batteryPercent: number;
    importW: number;
    exportW: number;
    gasTodayKWh: number;
    hotWaterTodayKWh: number;
    costToday: number;
    projectedMonthCost: number;
  };
  nodes: EnergyNode[];
}
