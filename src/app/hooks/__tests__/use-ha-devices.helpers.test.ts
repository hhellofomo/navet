import type { HassEntities, HassEntity } from 'home-assistant-js-websocket';
import { describe, expect, it } from 'vitest';
import type { HomeAssistantEntityRegistryEntry } from '@/app/services/home-assistant.service';
import {
  buildDeviceIndexes,
  getEntityCategory,
  mapHelperDevice,
  shouldSkipSwitchDevice,
  shouldSuppressHelperCard,
} from '../use-ha-devices.helpers';

function createEntity(
  entityId: string,
  state: string,
  attributes: Record<string, unknown> = {}
): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: '2026-05-13T00:00:00.000Z',
    last_updated: '2026-05-13T00:00:00.000Z',
    context: { id: 'ctx', parent_id: null, user_id: null },
  } as HassEntity;
}

function createRegistryMap(entries: HomeAssistantEntityRegistryEntry[]) {
  return new Map(entries.map((entry) => [entry.entity_id, entry]));
}

describe('use-ha-devices helpers', () => {
  it('collects sensor and config metrics for the owning switch device', () => {
    const entities: HassEntities = {
      'switch.kitchen_outlet': createEntity('switch.kitchen_outlet', 'on', {
        friendly_name: 'Kitchen outlet',
      }),
      'sensor.kitchen_outlet_power': createEntity('sensor.kitchen_outlet_power', '127', {
        friendly_name: 'Kitchen outlet power',
        device_class: 'power',
        unit_of_measurement: 'W',
      }),
      'select.kitchen_outlet_mode': createEntity('select.kitchen_outlet_mode', 'eco', {
        friendly_name: 'Outlet mode',
      }),
    };

    const entityRegistryMap = createRegistryMap([
      { entity_id: 'switch.kitchen_outlet', device_id: 'device-1' },
      { entity_id: 'sensor.kitchen_outlet_power', device_id: 'device-1' },
      {
        entity_id: 'select.kitchen_outlet_mode',
        device_id: 'device-1',
        entity_category: 'config',
      },
    ]);

    const indexes = buildDeviceIndexes(entities, entityRegistryMap);
    const metrics = indexes.switchMetricsByDeviceId.get('device-1');

    expect(metrics).toBeDefined();
    expect(metrics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Power', value: 127, unit: 'W', category: 'measurement' }),
        expect.objectContaining({
          label: 'Outlet mode',
          value: 'eco',
          unit: '',
          category: 'configuration',
        }),
      ])
    );
  });

  it('skips config metrics with non-display placeholder values', () => {
    const entities: HassEntities = {
      'switch.pax_calima_boostmode': createEntity('switch.pax_calima_boostmode', 'on', {
        friendly_name: 'Pax Calima BoostMode',
      }),
      'select.pax_calima_power_on_behaviour': createEntity(
        'select.pax_calima_power_on_behaviour',
        'PreviousValue',
        {
          friendly_name: 'Pax Calima Power-on behaviour',
        }
      ),
    };

    const entityRegistryMap = createRegistryMap([
      { entity_id: 'switch.pax_calima_boostmode', device_id: 'device-pax-calima' },
      {
        entity_id: 'select.pax_calima_power_on_behaviour',
        device_id: 'device-pax-calima',
        entity_category: 'config',
      },
    ]);

    const indexes = buildDeviceIndexes(entities, entityRegistryMap);

    expect(indexes.switchMetricsByDeviceId.get('device-pax-calima')).toBeUndefined();
  });

  it('skips cumulative total energy sensors for switch card metrics', () => {
    const entities: HassEntities = {
      'switch.garden_lights_switch': createEntity('switch.garden_lights_switch', 'on', {
        friendly_name: 'Garden Mains',
      }),
      'sensor.garden_mains_total_energy': createEntity(
        'sensor.garden_mains_total_energy',
        '0.092',
        {
          friendly_name: 'Garden Mains Total energy',
          device_class: 'energy',
          state_class: 'total_increasing',
          unit_of_measurement: 'kWh',
        }
      ),
      'sensor.garden_mains_energy_today': createEntity('sensor.garden_mains_energy_today', '1.4', {
        friendly_name: 'Garden Mains Energy today',
        device_class: 'energy',
        state_class: 'total_increasing',
        unit_of_measurement: 'kWh',
      }),
    };

    const entityRegistryMap = createRegistryMap([
      { entity_id: 'switch.garden_lights_switch', device_id: 'device-garden-mains' },
      { entity_id: 'sensor.garden_mains_total_energy', device_id: 'device-garden-mains' },
      { entity_id: 'sensor.garden_mains_energy_today', device_id: 'device-garden-mains' },
    ]);

    const indexes = buildDeviceIndexes(entities, entityRegistryMap);
    const metrics = indexes.switchMetricsByDeviceId.get('device-garden-mains');

    expect(metrics).toEqual([
      expect.objectContaining({ label: 'Energy', value: 1.4, unit: 'kWh' }),
    ]);
  });

  it('keeps primary switch selection deterministic for helper-like switches', () => {
    const entities: HassEntities = {
      'switch.bedroom_boost': createEntity('switch.bedroom_boost', 'off', {
        friendly_name: 'Bedroom boost',
      }),
      'switch.bedroom_main': createEntity('switch.bedroom_main', 'on', {
        friendly_name: 'Bedroom outlet',
      }),
    };
    const entityRegistryMap = createRegistryMap([
      { entity_id: 'switch.bedroom_boost', device_id: 'device-2' },
      { entity_id: 'switch.bedroom_main', device_id: 'device-2' },
    ]);

    const indexes = buildDeviceIndexes(entities, entityRegistryMap);

    expect(indexes.primarySwitchEntityIdByDeviceId.get('device-2')).toBe('switch.bedroom_main');
  });

  it('suppresses switches attached to climate or vacuum devices', () => {
    const entities: HassEntities = {
      'climate.hallway': createEntity('climate.hallway', 'heat'),
      'vacuum.roborock': createEntity('vacuum.roborock', 'docked'),
      'switch.hallway_boost': createEntity('switch.hallway_boost', 'off'),
      'switch.roborock_child_lock': createEntity('switch.roborock_child_lock', 'off'),
    };
    const entityRegistryMap = createRegistryMap([
      { entity_id: 'climate.hallway', device_id: 'device-climate' },
      { entity_id: 'vacuum.roborock', device_id: 'device-vacuum' },
      { entity_id: 'switch.hallway_boost', device_id: 'device-climate' },
      { entity_id: 'switch.roborock_child_lock', device_id: 'device-vacuum' },
    ]);

    const indexes = buildDeviceIndexes(entities, entityRegistryMap);

    expect(
      shouldSkipSwitchDevice(
        'switch.hallway_boost',
        entityRegistryMap.get('switch.hallway_boost'),
        indexes
      )
    ).toBe(true);
    expect(
      shouldSkipSwitchDevice(
        'switch.roborock_child_lock',
        entityRegistryMap.get('switch.roborock_child_lock'),
        indexes
      )
    ).toBe(true);
  });

  it('suppresses helper cards when a device already has a primary card', () => {
    const entities: HassEntities = {
      'switch.kitchen_main': createEntity('switch.kitchen_main', 'on'),
      'input_boolean.kitchen_timer': createEntity('input_boolean.kitchen_timer', 'off'),
    };
    const entityRegistryMap = createRegistryMap([
      { entity_id: 'switch.kitchen_main', device_id: 'device-3' },
      { entity_id: 'input_boolean.kitchen_timer', device_id: 'device-3' },
    ]);

    const indexes = buildDeviceIndexes(entities, entityRegistryMap);

    expect(
      shouldSuppressHelperCard('input_boolean.kitchen_timer', entityRegistryMap, indexes)
    ).toBe(true);
  });

  it('maps helper entities to the correct service behavior', () => {
    const t = ((key: string) => key) as Parameters<typeof mapHelperDevice>[5];
    const scriptHelper = mapHelperDevice(
      'script',
      'script.goodnight',
      createEntity('script.goodnight', 'off'),
      'Goodnight',
      'Bedroom',
      t
    );
    const buttonHelper = mapHelperDevice(
      'input_button',
      'input_button.reset',
      createEntity('input_button.reset', 'unknown'),
      'Reset',
      'Hallway',
      t
    );

    expect(scriptHelper).toEqual(
      expect.objectContaining({ serviceDomain: 'script', serviceAction: 'turn_on' })
    );
    expect(buttonHelper).toEqual(
      expect.objectContaining({
        serviceDomain: 'input_button',
        serviceAction: 'press',
        state: false,
      })
    );
  });

  it('reads config and diagnostic entity categories safely', () => {
    expect(getEntityCategory({ entity_category: 'config' })).toBe('config');
    expect(getEntityCategory({ entity_category: 'diagnostic' })).toBe('diagnostic');
    expect(getEntityCategory({ entity_category: 'unsupported' })).toBeNull();
  });
});
