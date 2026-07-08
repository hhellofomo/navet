import type { HassEntity } from 'home-assistant-js-websocket';
import type { CoverDevice } from '../../types/device.types';

export function mapCoverDevice(
  entityId: string,
  entity: HassEntity,
  name: string,
  room: string
): CoverDevice {
  return {
    id: entityId,
    name,
    room,
    size: 'medium',
    position: entity.attributes?.current_position || 0,
  };
}
