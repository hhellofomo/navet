import type { HassEntity } from 'home-assistant-js-websocket';
import { useMemo } from 'react';
import { useHomeAssistantContext } from '../contexts/home-assistant-context';
import type {
  ClimateDevice,
  CoverDevice,
  DeviceMetric,
  DeviceCollection,
  LightDevice,
  LockDevice,
  PersonDevice,
  SwitchDevice,
} from '../types/device.types';

/**
 * Maps Home Assistant entities to Navet device structure
 */
export const useHADevices = (): DeviceCollection => {
  const { areas, deviceRegistry, entities, entityRegistry } = useHomeAssistantContext();

  return useMemo(() => {
    const brightnessToPercent = (entityId: string, entity: HassEntity): number => {
      const brightnessPct = entity.attributes?.brightness_pct;
      if (typeof brightnessPct === 'number' && !Number.isNaN(brightnessPct)) {
        return Math.max(0, Math.min(100, Math.round(brightnessPct)));
      }

      const brightness = entity.attributes?.brightness;
      if (typeof brightness === 'number' && !Number.isNaN(brightness)) {
        return Math.max(0, Math.min(100, Math.round((brightness / 255) * 100)));
      }

      if (typeof brightnessPct === 'string') {
        const parsedBrightnessPct = Number.parseFloat(brightnessPct);
        if (!Number.isNaN(parsedBrightnessPct)) {
          return Math.max(0, Math.min(100, Math.round(parsedBrightnessPct)));
        }
      }

      if (typeof brightness === 'string') {
        const parsedBrightness = Number.parseFloat(brightness);
        if (!Number.isNaN(parsedBrightness)) {
          return Math.max(0, Math.min(100, Math.round((parsedBrightness / 255) * 100)));
        }
      }

      if (import.meta.env.DEV && entity.state === 'on') {
        console.debug('[Navet] Light missing brightness attributes', {
          entityId,
          attributes: entity.attributes,
        });
      }

      // Some integrations expose on/off without a brightness attribute.
      return entity.state === 'on' ? 100 : 0;
    };

    const normalizeKelvin = (entity: HassEntity): number => {
      const kelvin = entity.attributes?.color_temp_kelvin;
      if (typeof kelvin === 'number' && !Number.isNaN(kelvin)) {
        return Math.round(kelvin);
      }

      const mired = entity.attributes?.color_temp;
      if (typeof mired === 'number' && mired > 0) {
        return Math.round(1000000 / mired);
      }

      return 4000;
    };

    const parseNumberish = (value: unknown): number | null => {
      if (typeof value === 'number' && !Number.isNaN(value)) {
        return value;
      }

      if (typeof value === 'string') {
        const parsed = Number.parseFloat(value);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }

      return null;
    };

    const toWatts = (value: number, unit: unknown): number => {
      if (typeof unit !== 'string') {
        return value;
      }

      switch (unit.toLowerCase()) {
        case 'kw':
          return value * 1000;
        case 'mw':
          return value * 1000000;
        default:
          return value;
      }
    };

    const toVolts = (value: number, unit: unknown): number => {
      if (typeof unit !== 'string') {
        return value;
      }

      switch (unit.toLowerCase()) {
        case 'mv':
          return value / 1000;
        case 'kv':
          return value * 1000;
        default:
          return value;
      }
    };

    const toKilowattHours = (value: number, unit: unknown): number => {
      if (typeof unit !== 'string') {
        return value;
      }

      switch (unit.toLowerCase()) {
        case 'wh':
          return value / 1000;
        case 'mwh':
          return value * 1000;
        default:
          return value;
      }
    };

    if (!entities) {
      return {
        lights: [],
        hvac: [],
        climate: [],
        power: [],
        media: [],
        weather: [],
        wifi: [],
        switches: [],
        covers: [],
        locks: [],
        persons: [],
        sensors: [],
        vacuums: [],
        rssFeeds: [],
        calendars: [],
        'grouped-sensors': [],
      };
    }

    // Process entities into device collections
    const lights: LightDevice[] = [];
    const switches: SwitchDevice[] = [];
    const climate: ClimateDevice[] = [];
    const persons: PersonDevice[] = [];
    const covers: CoverDevice[] = [];
    const locks: LockDevice[] = [];
    const areaMap = new Map(areas.map((area) => [area.area_id, area.name]));
    const entityRegistryMap = new Map(
      entityRegistry.map((registryEntry) => [registryEntry.entity_id, registryEntry])
    );
    const deviceRegistryMap = new Map(deviceRegistry.map((device) => [device.id, device]));
    const switchMetricsByDeviceId = new Map<string, DeviceMetric[]>();

    // Resolve room from Home Assistant registries first, then fall back to entity attributes.
    const getRoom = (entityId: string, entity: HassEntity): string => {
      const entityEntry = entityRegistryMap.get(entityId);
      const deviceEntry = entityEntry?.device_id
        ? deviceRegistryMap.get(entityEntry.device_id)
        : undefined;
      const areaId = entityEntry?.area_id ?? deviceEntry?.area_id;

      if (areaId) {
        const areaName = areaMap.get(areaId);
        if (areaName) {
          return areaName;
        }
      }

      return (
        entity.attributes?.room ||
        entity.attributes?.area ||
        entity.attributes?.zone ||
        'Unknown Room'
      );
    };

    // Helper function to get friendly name or entity id
    const getName = (entity: HassEntity): string => {
      return entity.attributes?.friendly_name || entity.entity_id;
    };

    const inferMetricIcon = (
      deviceClass: string | null,
      searchText: string,
      unit: unknown
    ): DeviceMetric['icon'] => {
      const normalizedUnit = typeof unit === 'string' ? unit.toLowerCase() : '';
      const normalizedSearch = searchText.toLowerCase();

      if (
        deviceClass === 'motion' ||
        deviceClass === 'occupancy' ||
        normalizedSearch.includes('motion') ||
        normalizedSearch.includes('occupancy') ||
        normalizedSearch.includes('presence') ||
        normalizedSearch.includes('pir')
      ) {
        return 'motion';
      }

      if (
        deviceClass === 'power' ||
        normalizedSearch.includes('power') ||
        normalizedSearch.includes('watt') ||
        normalizedSearch.includes('consumption') ||
        normalizedUnit === 'w' ||
        normalizedUnit === 'kw' ||
        normalizedUnit === 'mw'
      ) {
        return 'zap';
      }

      if (
        deviceClass === 'voltage' ||
        normalizedSearch.includes('voltage') ||
        normalizedUnit === 'v' ||
        normalizedUnit === 'mv' ||
        normalizedUnit === 'kv'
      ) {
        return 'gauge';
      }

      if (
        deviceClass === 'temperature' ||
        normalizedSearch.includes('temperature') ||
        normalizedSearch.includes('temp') ||
        normalizedUnit.includes('c') ||
        normalizedUnit.includes('f')
      ) {
        return 'thermometer';
      }

      if (
        deviceClass === 'humidity' ||
        normalizedSearch.includes('humidity') ||
        normalizedUnit === '%'
      ) {
        return 'droplets';
      }

      if (
        deviceClass === 'current' ||
        deviceClass === 'energy' ||
        normalizedSearch.includes('current') ||
        normalizedSearch.includes('amp') ||
        normalizedSearch.includes('energy') ||
        normalizedUnit === 'a' ||
        normalizedUnit === 'ma' ||
        normalizedUnit === 'wh' ||
        normalizedUnit === 'kwh' ||
        normalizedUnit === 'mwh'
      ) {
        return 'activity';
      }

      return 'activity';
    };

    const getMetricLabel = (entityId: string, entity: HassEntity): string => {
      const friendlyName =
        typeof entity.attributes?.friendly_name === 'string'
          ? entity.attributes.friendly_name.trim()
          : '';
      if (friendlyName) {
        return friendlyName;
      }

      return (
        entityId
          .split('.')
          .slice(-1)[0]
          ?.replace(/_/g, ' ')
          .replace(/\b\w/g, (char: string) => char.toUpperCase()) ?? entityId
      );
    };

    const formatEntityType = (deviceClass: unknown, fallback: string): string => {
      if (typeof deviceClass === 'string' && deviceClass.trim()) {
        return deviceClass
          .trim()
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
      }

      return fallback;
    };

    const normalizeMetric = (
      deviceClass: string | null,
      friendlyName: string,
      rawValue: number,
      unit: unknown
    ): { label: string; unit: string; value: number } | null => {
      if (
        deviceClass === 'power' ||
        friendlyName.includes('power') ||
        unit === 'W' ||
        unit === 'kW' ||
        unit === 'MW'
      ) {
        return { label: 'Power', value: toWatts(rawValue, unit), unit: 'W' };
      }

      if (
        deviceClass === 'voltage' ||
        friendlyName.includes('voltage') ||
        unit === 'V' ||
        unit === 'mV' ||
        unit === 'kV'
      ) {
        return { label: 'Voltage', value: toVolts(rawValue, unit), unit: 'V' };
      }

      if (
        deviceClass === 'energy' ||
        friendlyName.includes('energy') ||
        unit === 'Wh' ||
        unit === 'kWh' ||
        unit === 'MWh'
      ) {
        return { label: 'Energy', value: toKilowattHours(rawValue, unit), unit: 'kWh' };
      }

      return null;
    };

    Object.entries(entities).forEach(([entityId, entity]) => {
      const domain = entityId.split('.')[0];
      if (domain === 'sensor') {
        const entityEntry = entityRegistryMap.get(entityId);
        const deviceId = entityEntry?.device_id;
        if (!deviceId) {
          return;
        }

        const rawValue =
          parseNumberish(entity.state) ??
          parseNumberish(entity.attributes?.native_value) ??
          parseNumberish(entity.attributes?.value);
        if (rawValue === null) {
          return;
        }

        const metricState = switchMetricsByDeviceId.get(deviceId) ?? [];
        const deviceClass =
          typeof entity.attributes?.device_class === 'string'
            ? entity.attributes.device_class.toLowerCase()
            : null;
        const unit =
          entity.attributes?.unit_of_measurement ?? entity.attributes?.native_unit_of_measurement;
        const friendlyName =
          typeof entity.attributes?.friendly_name === 'string'
            ? entity.attributes.friendly_name.toLowerCase()
            : '';
        const normalizedMetric = normalizeMetric(deviceClass, friendlyName, rawValue, unit);
        if (normalizedMetric) {
          const nextMetric: DeviceMetric = {
            ...normalizedMetric,
            icon: inferMetricIcon(
              deviceClass,
              `${entityId} ${friendlyName} ${entity.attributes?.friendly_name ?? ''}`,
              unit
            ),
            category: 'measurement',
          };
          const existingIndex = metricState.findIndex(
            (metric) => metric.label === nextMetric.label
          );
          if (existingIndex === -1) {
            metricState.push(nextMetric);
          } else {
            metricState[existingIndex] = nextMetric;
          }
        }

        switchMetricsByDeviceId.set(deviceId, metricState);
        return;
      }

      if (domain === 'number' || domain === 'input_number' || domain === 'select') {
        const entityEntry = entityRegistryMap.get(entityId);
        const deviceId = entityEntry?.device_id;
        const entityCategory = (entityEntry as { entity_category?: string | null } | undefined)
          ?.entity_category;
        if (!deviceId || entityCategory !== 'config') {
          return;
        }

        const metricState = switchMetricsByDeviceId.get(deviceId) ?? [];
        const label = getMetricLabel(entityId, entity);
        const unit =
          typeof entity.attributes?.unit_of_measurement === 'string'
            ? entity.attributes.unit_of_measurement
            : typeof entity.attributes?.native_unit_of_measurement === 'string'
              ? entity.attributes.native_unit_of_measurement
              : '';
        const parsedValue =
          domain === 'select'
            ? entity.state
            : (parseNumberish(entity.state) ??
              parseNumberish(entity.attributes?.native_value) ??
              parseNumberish(entity.attributes?.value));
        if (parsedValue == null || parsedValue === '') {
          return;
        }

        const nextMetric: DeviceMetric = {
          label,
          value: parsedValue,
          unit,
          icon: inferMetricIcon(null, `${entityId} ${label}`, unit),
          category: 'configuration',
        };
        const existingIndex = metricState.findIndex((metric) => metric.label === nextMetric.label);
        if (existingIndex === -1) {
          metricState.push(nextMetric);
        } else {
          metricState[existingIndex] = nextMetric;
        }

        switchMetricsByDeviceId.set(deviceId, metricState);
      }
    });

    // Process each entity based on domain
    Object.entries(entities).forEach(([entityId, entity]) => {
      const domain = entityId.split('.')[0];
      const name = getName(entity);
      const room = getRoom(entityId, entity);

      switch (domain) {
        case 'light':
          lights.push({
            id: entityId,
            name,
            room,
            size: 'small',
            state: entity.state === 'on',
            brightness: brightnessToPercent(entityId, entity),
            temp: normalizeKelvin(entity),
          });
          break;

        case 'switch':
          const entityEntry = entityRegistryMap.get(entityId);
          const deviceMetrics = entityEntry?.device_id
            ? switchMetricsByDeviceId.get(entityEntry.device_id)
            : undefined;
          const powerMetric = deviceMetrics?.find((metric) => metric.label === 'Power');
          const voltageMetric = deviceMetrics?.find((metric) => metric.label === 'Voltage');
          const energyMetric = deviceMetrics?.find((metric) => metric.label === 'Energy');
          switches.push({
            id: entityId,
            name,
            room,
            size: 'small',
            state: entity.state === 'on',
            entityType: formatEntityType(entity.attributes?.device_class, 'Switch'),
            power:
              parseNumberish(entity.attributes?.power) ??
              parseNumberish(entity.attributes?.current_power_w) ??
              (typeof powerMetric?.value === 'number' ? powerMetric.value : undefined),
            voltage:
              parseNumberish(entity.attributes?.voltage) ??
              parseNumberish(entity.attributes?.current_voltage) ??
              (typeof voltageMetric?.value === 'number' ? voltageMetric.value : undefined),
            energy:
              parseNumberish(entity.attributes?.energy) ??
              parseNumberish(entity.attributes?.energy_today) ??
              (typeof energyMetric?.value === 'number' ? energyMetric.value : undefined),
            metrics: deviceMetrics,
          });
          break;

        case 'climate':
          climate.push({
            id: entityId,
            name,
            room,
            size: 'medium',
            temperature: parseFloat(entity.attributes?.temperature) || 0,
            mode: entity.attributes?.hvac_mode || 'off',
          });
          break;

        case 'person':
          persons.push({
            id: entityId,
            name,
            size: 'small',
            location: entity.state,
            state: entity.state === 'home' ? 'home' : 'away',
          });
          break;

        case 'cover':
          covers.push({
            id: entityId,
            name,
            room,
            size: 'medium',
            position: entity.attributes?.current_position || 0,
          });
          break;

        case 'lock':
          locks.push({
            id: entityId,
            name,
            room,
            size: 'small',
            state: entity.state === 'locked',
          });
          break;
      }
    });

    return {
      lights,
      hvac: [],
      climate,
      power: [],
      media: [],
      weather: [],
      wifi: [],
      switches,
      covers,
      locks,
      persons,
      sensors: [],
      vacuums: [],
      rssFeeds: [],
      calendars: [],
      'grouped-sensors': [],
    };
  }, [areas, deviceRegistry, entities, entityRegistry]);
};
