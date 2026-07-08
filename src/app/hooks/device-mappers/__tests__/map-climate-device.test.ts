import type { HassEntity } from 'home-assistant-js-websocket';
import { describe, expect, it } from 'vitest';
import { mapClimateDevice } from '../map-climate-device';

function createClimateEntity(attributes: Record<string, unknown>): HassEntity {
  return {
    entity_id: 'climate.hallway',
    state: 'heat',
    attributes,
    last_changed: '2026-05-17T00:00:00.000Z',
    last_updated: '2026-05-17T00:00:00.000Z',
    context: { id: 'ctx', parent_id: null, user_id: null },
  } as HassEntity;
}

describe('mapClimateDevice', () => {
  it('preserves supported Home Assistant HVAC modes', () => {
    const device = mapClimateDevice(
      'climate.hallway',
      createClimateEntity({
        temperature: 21,
        current_temperature: 20,
        hvac_modes: ['heat', 'cool', 'fan_only'],
      }),
      'Hallway',
      'Hallway'
    );

    expect(device.supportedHvacModes).toEqual(['heat', 'cool', 'fan_only']);
  });

  it('ignores malformed HVAC mode entries', () => {
    const device = mapClimateDevice(
      'climate.hallway',
      createClimateEntity({
        temperature: 21,
        current_temperature: 20,
        hvac_modes: ['heat', 1, null, 'cool'],
      }),
      'Hallway',
      'Hallway'
    );

    expect(device.supportedHvacModes).toEqual(['heat', 'cool']);
  });
});
