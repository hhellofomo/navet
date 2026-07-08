import type { HassEntity } from 'home-assistant-js-websocket';
import type { CameraDevice } from '../../types/device.types';

export function mapCameraDevice(
  entityId: string,
  entity: HassEntity,
  name: string,
  room: string
): CameraDevice {
  return {
    id: entityId,
    name,
    room,
    size: 'medium',
    entityPicture:
      typeof entity.attributes?.entity_picture === 'string'
        ? entity.attributes.entity_picture
        : undefined,
    state: entity.state,
  };
}
