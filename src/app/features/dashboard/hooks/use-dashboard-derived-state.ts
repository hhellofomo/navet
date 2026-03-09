import { useCallback, useMemo } from 'react';
import type { DeviceWithType } from '@/app/types/device.types';
import { getDeviceRoom, getDeviceRoomLabel } from '@/app/utils/device-location';
import type { CustomCard } from './use-custom-cards';

interface UseDashboardDerivedStateParams {
  activeRoom: string;
  allCustomCards: CustomCard[];
  availableDeviceMap: Map<string, DeviceWithType>;
  cardOrders: Record<string, string[]>;
  deviceMap: Map<string, DeviceWithType>;
  hiddenEntityIds: string[];
  roomOrder: string[];
}

export function useDashboardDerivedState({
  activeRoom,
  allCustomCards,
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

  const getCardRoom = useCallback(
    (cardId: string) => {
      const device = deviceMap.get(cardId);
      if (device) {
        return getDeviceRoomLabel(device);
      }

      const customCard = allCustomCards.find((card) => card.id === cardId);
      return customCard?.room ?? null;
    },
    [allCustomCards, deviceMap]
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
    getCardRoom,
    lightDeviceMap,
    lightRooms,
    orderedCardIds,
  };
}
