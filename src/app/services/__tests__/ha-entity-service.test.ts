import { beforeEach, describe, expect, it, vi } from 'vitest';
import HAEntityService from '../ha-entity-service';

const { callServiceMock } = vi.hoisted(() => ({
  callServiceMock: vi.fn(),
}));

vi.mock('home-assistant-js-websocket', () => ({
  callService: callServiceMock,
}));

describe('HAEntityService', () => {
  beforeEach(() => {
    callServiceMock.mockReset();
  });

  it('sets climate HVAC mode through the Home Assistant climate service', async () => {
    const connection = { id: 'connection' };
    const service = new HAEntityService(() => connection as never);

    await service.setClimateHvacMode('climate.hallway', 'heat');

    expect(callServiceMock).toHaveBeenCalledWith(
      connection,
      'climate',
      'set_hvac_mode',
      {
        entity_id: 'climate.hallway',
        hvac_mode: 'heat',
      },
      { entity_id: 'climate.hallway' }
    );
  });

  it('sets water heater operation mode through the Home Assistant water heater service', async () => {
    const connection = { id: 'connection' };
    const service = new HAEntityService(() => connection as never);

    await service.setClimateHvacMode('water_heater.boiler', 'eco');

    expect(callServiceMock).toHaveBeenCalledWith(
      connection,
      'water_heater',
      'set_operation_mode',
      {
        entity_id: 'water_heater.boiler',
        operation_mode: 'eco',
      },
      { entity_id: 'water_heater.boiler' }
    );
  });

  it('sets water heater temperature through the Home Assistant water heater service', async () => {
    const connection = { id: 'connection' };
    const service = new HAEntityService(() => connection as never);

    await service.setClimateTemperature('water_heater.boiler', 55);

    expect(callServiceMock).toHaveBeenCalledWith(
      connection,
      'water_heater',
      'set_temperature',
      {
        entity_id: 'water_heater.boiler',
        temperature: 55,
      },
      { entity_id: 'water_heater.boiler' }
    );
  });
});
