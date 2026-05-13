import type { HassEntity } from 'home-assistant-js-websocket';
import type { ClimateDevice } from '../../types/device.types';
import { parseNumberish } from '../ha-entity-utils';

export function mapClimateDevice(
  entityId: string,
  entity: HassEntity,
  name: string,
  room: string
): ClimateDevice {
  return {
    id: entityId,
    name,
    room,
    size: 'medium',
    temperature: parseFloat(entity.attributes?.temperature) || 0,
    currentTemperature:
      parseNumberish(entity.attributes?.current_temperature) ??
      (parseFloat(entity.attributes?.temperature ?? '0') || 0),
    mode:
      (typeof entity.state === 'string' && entity.state) ||
      (typeof entity.attributes?.hvac_mode === 'string' && entity.attributes.hvac_mode) ||
      'off',
    action:
      (typeof entity.attributes?.hvac_action === 'string' && entity.attributes.hvac_action) ||
      undefined,
  };
}
