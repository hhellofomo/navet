import { useCallback, useDeferredValue, useMemo } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { useSearch } from '@/app/hooks';
import type { DeviceWithType } from '@/app/types/device.types';
import { getDeviceRoomLabel } from '@/app/utils/device-location';
import type { RoomSectionData } from './all-view-grid.types';
import type { CustomCard } from './stores/custom-cards-store';

interface UseAllViewGridParams {
  cardOrders: Record<string, string[]>;
  customCards: CustomCard[];
  deviceMap: Map<string, DeviceWithType>;
  rooms: string[];
  updateCardSize: (id: string, size: CardSize) => void;
}

export function useAllViewGrid({
  cardOrders,
  customCards,
  deviceMap,
  rooms,
  updateCardSize,
}: UseAllViewGridParams) {
  const { isSearchActive, filteredDeviceIds } = useSearch();
  const deferredFilteredDeviceIds = useDeferredValue(filteredDeviceIds);

  const handleSizeChange = useCallback(
    (id: string, size: CardSize) => {
      updateCardSize(id, size);
    },
    [updateCardSize]
  );

  const filteredDeviceIdSet = useMemo(
    () => new Set(deferredFilteredDeviceIds),
    [deferredFilteredDeviceIds]
  );

  const devicesByRoom = useMemo(() => {
    const grouped: Record<string, DeviceWithType[]> = {};

    deviceMap.forEach((device) => {
      if (isSearchActive && !filteredDeviceIdSet.has(device.id)) {
        return;
      }

      const room = getDeviceRoomLabel(device);
      if (!grouped[room]) {
        grouped[room] = [];
      }
      grouped[room].push(device);
    });

    return grouped;
  }, [deviceMap, filteredDeviceIdSet, isSearchActive]);

  const customCardsByRoom = useMemo(() => {
    const grouped: Record<string, CustomCard[]> = {};

    customCards.forEach((card) => {
      if (!card.room) {
        return;
      }

      if (!grouped[card.room]) {
        grouped[card.room] = [];
      }
      grouped[card.room].push(card);
    });

    return grouped;
  }, [customCards]);

  const customCardMap = useMemo(
    () => new Map(customCards.map((card) => [card.id, card])),
    [customCards]
  );

  const roomSections = useMemo<RoomSectionData[]>(
    () =>
      rooms
        .map((room) => {
          const roomDevices = devicesByRoom[room] || [];
          const roomCustomCards = customCardsByRoom[room] || [];
          const totalItems = roomDevices.length + roomCustomCards.length;
          const orderedRoomIds = (cardOrders[room] || []).filter(
            (id) =>
              roomDevices.some((device) => device.id === id) ||
              roomCustomCards.some((card) => card.id === id)
          );

          return { room, orderedRoomIds, totalItems };
        })
        .filter((section) => section.totalItems > 0),
    [cardOrders, customCardsByRoom, devicesByRoom, rooms]
  );

  return {
    customCardMap,
    devicesByRoom,
    handleSizeChange,
    roomSections,
  };
}
