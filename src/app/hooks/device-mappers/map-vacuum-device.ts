import type { HassEntity } from 'home-assistant-js-websocket';
import type { VacuumDevice } from '../../types/device.types';
import { parseNumberish } from '../ha-entity-utils';

export function mapVacuumDevice(
  entityId: string,
  entity: HassEntity,
  name: string,
  room: string
): VacuumDevice {
  const batteryLevel = parseNumberish(entity.attributes?.battery_level);
  const cleanedAreaValue =
    parseNumberish(entity.attributes?.cleaned_area) ??
    parseNumberish(entity.attributes?.cleaned_area_today) ??
    parseNumberish(entity.attributes?.last_cleaned_area);
  const cleaningTimeMinutes =
    parseNumberish(entity.attributes?.cleaning_time) ??
    parseNumberish(entity.attributes?.clean_time) ??
    parseNumberish(entity.attributes?.cleaning_duration);

  const normalizedStatus: VacuumDevice['status'] =
    entity.state === 'cleaning'
      ? 'cleaning'
      : entity.state === 'returning'
        ? 'returning'
        : entity.state === 'docked'
          ? 'docked'
          : entity.state === 'paused'
            ? 'paused'
            : 'idle';

  return {
    id: entityId,
    name,
    room,
    size: 'medium',
    status: normalizedStatus,
    battery: typeof batteryLevel === 'number' ? Math.max(0, Math.min(100, batteryLevel)) : 0,
    cleanedArea:
      typeof cleanedAreaValue === 'number'
        ? `${cleanedAreaValue.toFixed(cleanedAreaValue >= 10 ? 0 : 1)} m²`
        : undefined,
    cleaningTime:
      typeof cleaningTimeMinutes === 'number'
        ? `${Math.max(0, Math.round(cleaningTimeMinutes))} min`
        : undefined,
  };
}
