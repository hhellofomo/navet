import { useCallback, useMemo, useRef } from 'react';
import type { DeviceCollection, DeviceWithType } from '../types/device.types';

const isShallowEqualValue = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) {
    return true;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length &&
      left.every((item, index) => {
        const candidate = right[index];

        if (
          typeof item === 'object' &&
          item !== null &&
          typeof candidate === 'object' &&
          candidate !== null
        ) {
          const leftKeys = Object.keys(item as Record<string, unknown>);
          const rightKeys = Object.keys(candidate as Record<string, unknown>);

          return (
            leftKeys.length === rightKeys.length &&
            leftKeys.every((key) =>
              Object.is(
                (item as Record<string, unknown>)[key],
                (candidate as Record<string, unknown>)[key]
              )
            )
          );
        }

        return Object.is(item, candidate);
      })
    );
  }

  return false;
};

const isEquivalentDevice = (left: DeviceWithType | undefined, right: DeviceWithType): boolean => {
  if (!left) {
    return false;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every((key) =>
      isShallowEqualValue(
        (left as Record<string, unknown>)[key],
        (right as Record<string, unknown>)[key]
      )
    )
  );
};

/**
 * Custom hook for creating and memoizing device map
 * Optimizes performance by preventing unnecessary recalculations
 */
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
  const previousDeviceMapRef = useRef<Map<string, DeviceWithType>>(new Map());
  const deviceMap = useMemo(() => {
    const nextDeviceMap = new Map<string, DeviceWithType>();
    const previousDeviceMap = previousDeviceMapRef.current;
    const deviceGroups = [
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

    deviceGroups.forEach(([type, deviceArray]) => {
      deviceArray.forEach((device) => {
        const nextDevice = { ...device, type } as DeviceWithType;
        const previousDevice = previousDeviceMap.get(device.id);
        const stableDevice =
          previousDevice && isEquivalentDevice(previousDevice, nextDevice)
            ? previousDevice
            : nextDevice;

        nextDeviceMap.set(device.id, stableDevice);
      });
    });

    previousDeviceMapRef.current = nextDeviceMap;
    return nextDeviceMap;
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
    (id: string): DeviceWithType | undefined => {
      return deviceMap.get(id);
    },
    [deviceMap]
  );

  return { deviceMap, getDevice };
};
