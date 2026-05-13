import type { HassEntity } from 'home-assistant-js-websocket';
import type { SceneDevice } from '../../types/device.types';

export function mapSceneDevice(
  entityId: string,
  _entity: HassEntity,
  name: string,
  room: string
): SceneDevice {
  return {
    id: entityId,
    name,
    room,
    size: 'small',
  };
}
