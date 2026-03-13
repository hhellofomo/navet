import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/app/constants/storage-keys';
import type { Device, DeviceCollection } from '@/app/types/device.types';
import { getDeviceRoomLabel } from '@/app/utils/device-location';
import { storage } from '@/app/utils/storage';
import type { CustomCard } from './use-custom-cards';

export const useCardOrdering = (
  devices: DeviceCollection,
  rooms: string[],
  customCards: CustomCard[] = []
) => {
  const safeCustomCards = Array.isArray(customCards) ? customCards : [];

  const buildOrders = useCallback(() => {
    const orders: Record<string, string[]> = {};

    rooms.forEach((room) => {
      const roomCards: string[] = [];
      Object.values(devices).forEach((deviceArray) => {
        (deviceArray as Device[]).forEach((device: Device) => {
          if (getDeviceRoomLabel(device) === room) {
            roomCards.push(device.id);
          }
        });
      });
      safeCustomCards.forEach((card) => {
        if (card.room === room || card.room === 'All') {
          roomCards.push(card.id);
        }
      });
      orders[room] = roomCards;
    });

    return orders;
  }, [devices, rooms, safeCustomCards]);

  const [cardOrders, setCardOrders] = useState<Record<string, string[]>>(() => {
    const stored = storage.get<Record<string, string[]> | null>(STORAGE_KEYS.cardOrders, null);
    if (stored) {
      const allDeviceIds = new Set(
        Object.values(devices)
          .flat()
          .map((d) => d.id)
      );
      safeCustomCards.forEach((card) => {
        allDeviceIds.add(card.id);
      });
      const isValid = Object.values(stored).every(
        (orderArray) =>
          Array.isArray(orderArray) &&
          orderArray.every((id) => typeof id === 'string' && allDeviceIds.has(id))
      );
      if (isValid) {
        return stored;
      }
    }

    return buildOrders();
  });

  useEffect(() => {
    const allDeviceIds = new Set(
      Object.values(devices)
        .flat()
        .map((device) => device.id)
    );
    safeCustomCards.forEach((card) => {
      allDeviceIds.add(card.id);
    });

    setCardOrders((prev) => {
      const next = buildOrders();
      const mergedOrders: Record<string, string[]> = {};
      const allRooms = new Set([...Object.keys(prev), ...Object.keys(next)]);

      allRooms.forEach((room) => {
        const order = prev[room];
        if (!Array.isArray(order)) {
          mergedOrders[room] = next[room] ?? [];
          return;
        }

        const roomOrder = next[room] ?? [];
        const validRoomIds = new Set(roomOrder);
        const preserved = order.filter((id) => allDeviceIds.has(id) && validRoomIds.has(id));
        const additions = roomOrder.filter((id) => !preserved.includes(id));
        mergedOrders[room] = [...preserved, ...additions];
      });

      const prevRooms = Object.keys(prev);
      const nextRooms = Object.keys(mergedOrders);
      const changed =
        prevRooms.length !== nextRooms.length ||
        nextRooms.some((room) => {
          const previousOrder = prev[room] ?? [];
          const nextOrder = mergedOrders[room] ?? [];

          return (
            previousOrder.length !== nextOrder.length ||
            previousOrder.some((id, index) => id !== nextOrder[index])
          );
        });

      if (!changed) {
        return prev;
      }

      return mergedOrders;
    });
  }, [buildOrders, devices, safeCustomCards]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.cardOrders, cardOrders);
  }, [cardOrders]);

  const moveCard = useCallback((room: string, dragIndex: number, hoverIndex: number) => {
    setCardOrders((prev) => {
      const newOrders = { ...prev };
      const roomCards = [...newOrders[room]];
      const [removed] = roomCards.splice(dragIndex, 1);
      roomCards.splice(hoverIndex, 0, removed);
      newOrders[room] = roomCards;
      return newOrders;
    });
  }, []);

  return { cardOrders, moveCard };
};
