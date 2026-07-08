import { useCallback, useDeferredValue, useMemo } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { getDeviceTypeLabel } from '@/app/constants/device-type-labels';
import { useSearch } from '@/app/hooks';
import type { DeviceWithType } from '@/app/types/device.types';
import { getDeviceRoomLabel, UNKNOWN_ROOM_LABEL } from '@/app/utils/device-location';
import type { AllViewGrouping, AllViewSectionData } from './all-view-grid.types';
import type { CustomCard } from './stores/custom-cards-store';

interface UseAllViewGridParams {
  cardOrders: Record<string, string[]>;
  customCards: CustomCard[];
  deviceMap: Map<string, DeviceWithType>;
  grouping: AllViewGrouping;
  rooms: string[];
  updateCardSize: (id: string, size: CardSize) => void;
}

export function useAllViewGrid({
  cardOrders,
  customCards,
  deviceMap,
  grouping,
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

  const orderedRoomEntries = useMemo(
    () =>
      rooms.map((room) => {
        const roomDevices = devicesByRoom[room] || [];
        const roomCustomCards = customCardsByRoom[room] || [];
        const validIds = new Set([
          ...roomDevices.map((device) => device.id),
          ...roomCustomCards.map((card) => card.id),
        ]);
        const orderedIds = (cardOrders[room] || []).filter((id) => validIds.has(id));

        return {
          room,
          orderedIds,
          totalItems: validIds.size,
        };
      }),
    [cardOrders, customCardsByRoom, devicesByRoom, rooms]
  );

  const allOrderedIds = useMemo(
    () => orderedRoomEntries.flatMap((entry) => entry.orderedIds),
    [orderedRoomEntries]
  );

  const roomSections = useMemo<AllViewSectionData[]>(() => {
    if (grouping === 'none') {
      return allOrderedIds.length > 0
        ? [
            {
              key: 'all-items',
              title: 'All Items',
              orderedIds: allOrderedIds,
              totalItems: allOrderedIds.length,
              showHeader: false,
            },
          ]
        : [];
    }

    if (grouping === 'type') {
      const grouped = new Map<string, string[]>();

      allOrderedIds.forEach((id) => {
        const customCard = customCardMap.get(id);
        if (customCard) {
          const existing = grouped.get('Widgets') ?? [];
          existing.push(id);
          grouped.set('Widgets', existing);
          return;
        }

        const device = deviceMap.get(id);
        if (!device) {
          return;
        }

        const title = getDeviceTypeLabel(device.type);
        const existing = grouped.get(title) ?? [];
        existing.push(id);
        grouped.set(title, existing);
      });

      return Array.from(grouped.entries())
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([title, orderedIds]) => ({
          key: `type:${title}`,
          title,
          orderedIds,
          totalItems: orderedIds.length,
        }));
    }

    const visibleEntries = orderedRoomEntries.filter((entry) => entry.totalItems > 0);
    const orderedEntries =
      grouping === 'room'
        ? [...visibleEntries].sort((left, right) => left.room.localeCompare(right.room))
        : visibleEntries;

    return orderedEntries.map((entry) => ({
      key: `room:${entry.room}`,
      title: entry.room,
      orderedIds: entry.orderedIds,
      totalItems: entry.totalItems,
      mutedTitle: entry.room === UNKNOWN_ROOM_LABEL,
    }));
  }, [allOrderedIds, customCardMap, deviceMap, grouping, orderedRoomEntries]);

  return {
    customCardMap,
    handleSizeChange,
    roomSections,
  };
}
