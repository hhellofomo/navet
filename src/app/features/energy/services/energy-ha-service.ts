import type { Connection } from 'home-assistant-js-websocket';
import type {
  EnergyConsumerCategory,
  EnergyDeviceSource,
  EnergySourceConfig,
} from '../types/energy.types';

// ─── HA WebSocket API shapes ────────────────────────────────────────────────

interface HaEnergySolarSource {
  type: 'solar';
  stat_energy_from: string;
}

interface HaEnergyGridSource {
  type: 'grid';
  flow_from: { stat_energy_from: string }[];
  flow_to: { stat_energy_to: string }[];
}

interface HaEnergyBatterySource {
  type: 'battery';
  stat_energy_from: string; // discharge
  stat_energy_to: string; // charge
}

interface HaEnergyGasOrWaterSource {
  type: 'gas' | 'water';
  stat_energy_from: string;
}

type HaEnergySource =
  | HaEnergySolarSource
  | HaEnergyGridSource
  | HaEnergyBatterySource
  | HaEnergyGasOrWaterSource;

interface HaDeviceConsumption {
  stat_consumption: string;
  name?: string;
}

export interface HaEnergyPrefs {
  energy_sources: HaEnergySource[];
  device_consumption: HaDeviceConsumption[];
}

// ─── API call ────────────────────────────────────────────────────────────────

export async function getEnergyPrefs(connection: Connection): Promise<HaEnergyPrefs> {
  return connection.sendMessagePromise({ type: 'energy/get_prefs' }) as Promise<HaEnergyPrefs>;
}

// ─── Heuristics ──────────────────────────────────────────────────────────────

/**
 * Try to guess a live power (W) sensor from a cumulative energy (kWh) sensor id.
 * e.g. sensor.solar_energy_today → sensor.solar_power
 *      sensor.grid_import_kwh   → sensor.grid_import_w
 * Returns undefined if no transformation is possible.
 */
function guessPowerEntityId(energyEntityId: string): string | undefined {
  const transformed = energyEntityId
    .replace(/_energy(_today|_total|_kwh)?$/, '_power')
    .replace(/_kwh$/, '_w');
  return transformed !== energyEntityId ? transformed : undefined;
}

const DEVICE_CATEGORY_HINTS: [string, EnergyConsumerCategory][] = [
  ['ev_charger', 'ev_charger'],
  ['ev', 'ev_charger'],
  ['charger', 'ev_charger'],
  ['hvac', 'hvac'],
  ['heat_pump', 'hvac'],
  ['aircon', 'hvac'],
  ['water_heater', 'water_heater'],
  ['boiler', 'water_heater'],
  ['floor_heating', 'floor_heating'],
  ['underfloor', 'floor_heating'],
  ['washer', 'washer'],
  ['washing_machine', 'washer'],
  ['dryer', 'dryer'],
  ['dishwasher', 'dishwasher'],
  ['toilet_heater', 'toilet_heater'],
  ['bathroom_heater', 'bathroom_heater'],
];

function guessDeviceCategory(name: string): EnergyConsumerCategory {
  const lc = name.toLowerCase();
  return DEVICE_CATEGORY_HINTS.find(([k]) => lc.includes(k))?.[1] ?? 'other';
}

// ─── Prefs → config mapping ──────────────────────────────────────────────────

/**
 * Convert HA energy preferences into an EnergySourceConfig.
 * Power sensor IDs are guessed heuristically — the user should review and
 * correct them in the setup form before saving.
 */
export function mapPrefsToConfig(prefs: HaEnergyPrefs): EnergySourceConfig {
  const config: EnergySourceConfig = { devices: [] };

  for (const source of prefs.energy_sources) {
    switch (source.type) {
      case 'solar':
        config.solarEnergyEntityId = source.stat_energy_from;
        config.solarPowerEntityId = guessPowerEntityId(source.stat_energy_from);
        break;

      case 'grid': {
        const gridSource = source as HaEnergyGridSource;
        const importId = gridSource.flow_from?.[0]?.stat_energy_from;
        const exportId = gridSource.flow_to?.[0]?.stat_energy_to;
        if (importId) {
          config.gridImportEnergyEntityId = importId;
          config.gridImportPowerEntityId = guessPowerEntityId(importId);
        }
        if (exportId) {
          config.gridExportEnergyEntityId = exportId;
          config.gridExportPowerEntityId = guessPowerEntityId(exportId);
        }
        break;
      }

      case 'battery':
        // SOC sensor is not in energy prefs — the user must set it manually.
        // Battery power sign convention also varies per integration.
        // Battery discharge/charge stats are not mapped until battery support is added.
        break;
    }
  }

  const devices: EnergyDeviceSource[] = prefs.device_consumption.map((device) => {
    const name = device.name ?? device.stat_consumption;
    return {
      entityId: device.stat_consumption,
      name,
      category: guessDeviceCategory(name),
      powerEntityId: guessPowerEntityId(device.stat_consumption),
    };
  });
  config.devices = devices;

  return config;
}
