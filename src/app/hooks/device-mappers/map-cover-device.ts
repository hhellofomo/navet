import type { HassEntity } from 'home-assistant-js-websocket';
import type { CoverDevice } from '../../types/device.types';

export function mapCoverDevice(
  entityId: string,
  entity: HassEntity,
  name: string,
  room: string
): CoverDevice {
  const currentPosition = entity.attributes?.current_position;
  const supportedFeatures = entity.attributes?.supported_features;

  return {
    id: entityId,
    name,
    room,
    size: 'medium',
    position: typeof currentPosition === 'number' ? currentPosition : 0,
    supportedFeatures: typeof supportedFeatures === 'number' ? supportedFeatures : undefined,
    hasPosition: typeof currentPosition === 'number',
  };
}
