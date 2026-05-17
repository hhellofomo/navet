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
});
