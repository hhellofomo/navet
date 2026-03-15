import { useCallback, useMemo } from 'react';
import type { DeviceCollection, DeviceWithType } from '../types/device.types';

export const useDeviceMap = (devices: DeviceCollection) => {
  const {
    lights,
    hvac,
    climate,
    power,
    media,
    weather,
    switches,
    covers,
    locks,
    persons,
    sensors,
    vacuums,
    calendars,
    'grouped-sensors': groupedSensors,
  } = devices;

  const deviceMap = useMemo(() => {
    const map = new Map<string, DeviceWithType>();
    const groups = [
      ['lights', lights],
      ['hvac', hvac],
      ['climate', climate],
      ['power', power],
      ['media', media],
      ['weather', weather],
      ['switches', switches],
      ['covers', covers],
      ['locks', locks],
      ['persons', persons],
      ['sensors', sensors],
      ['vacuums', vacuums],
      ['calendars', calendars],
      ['grouped-sensors', groupedSensors],
    ] as const;

    for (const [type, arr] of groups) {
      for (const device of arr) {
        map.set(device.id, { ...device, type } as DeviceWithType);
      }
    }

    return map;
  }, [
    calendars,
    climate,
    covers,
    groupedSensors,
    hvac,
    lights,
    locks,
    media,
    persons,
    power,
    sensors,
    switches,
    vacuums,
    weather,
  ]);

  const getDevice = useCallback(
    (id: string): DeviceWithType | undefined => deviceMap.get(id),
    [deviceMap]
  );

  return { deviceMap, getDevice };
};
