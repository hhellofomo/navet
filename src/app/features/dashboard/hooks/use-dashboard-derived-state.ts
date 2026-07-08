import { useMemo } from 'react';
import type { DeviceWithType } from '@/app/types/device.types';
import { getDeviceRoom } from '@/app/utils/device-location';

interface UseDashboardDerivedStateParams {
  activeRoom: string;
  availableDeviceMap: Map<string, DeviceWithType>;
  cardOrders: Record<string, string[]>;
  deviceMap: Map<string, DeviceWithType>;
  hiddenEntityIds: string[];
  roomOrder: string[];
}

export function useDashboardDerivedState({
  activeRoom,
  availableDeviceMap,
  cardOrders,
  deviceMap,
  hiddenEntityIds,
  roomOrder,
}: UseDashboardDerivedStateParams) {
  const allEntityIds = useMemo(() => Array.from(availableDeviceMap.keys()), [availableDeviceMap]);
  const addableEntityIds = useMemo(
    () => (hiddenEntityIds.length > 0 ? hiddenEntityIds : allEntityIds),
    [allEntityIds, hiddenEntityIds]
  );

  const lightDeviceMap = useMemo(
    () => new Map(Array.from(deviceMap.entries()).filter(([, device]) => device.type === 'lights')),
    [deviceMap]
  );

  const lightRooms = useMemo(() => {
    const roomsWithLights = new Set<string>();
    lightDeviceMap.forEach((device) => {
      const room = getDeviceRoom(device);
      if (room) {
        roomsWithLights.add(room);
      }
    });
    return roomOrder.filter((room) => roomsWithLights.has(room));
  }, [lightDeviceMap, roomOrder]);

  const orderedCardIds = cardOrders[activeRoom] || [];

  return {
    addableEntityIds,
    allEntityIds,
    lightDeviceMap,
    lightRooms,
    orderedCardIds,
  };
}
