import { useCallback, useEffect, useState } from 'react';
import type { CustomCard } from './use-custom-cards';

interface Device {
  id: string;
  room?: string;
  location?: string;
  [key: string]: string | number | boolean | undefined;
}

const CARD_ORDERS_STORAGE_KEY = 'ha-dashboard-card-orders';

/**
 * Custom hook for managing card ordering within rooms via drag-and-drop
 * Handles initialization and updates of card positions with localStorage persistence
 */
export const useCardOrdering = (
  devices: Record<string, Device[]>,
  rooms: string[],
  customCards: CustomCard[] = []
) => {
  const safeCustomCards = Array.isArray(customCards) ? customCards : [];

  const buildOrders = useCallback(() => {
    const orders: Record<string, string[]> = {};

    rooms.forEach((room) => {
      const roomCards: string[] = [];
      Object.values(devices).forEach((deviceArray) => {
        deviceArray.forEach((device) => {
          if ('room' in device && device.room === room) {
            roomCards.push(device.id);
          } else if ('location' in device && device.location === room) {
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
    // Try to load from localStorage first
    const stored = localStorage.getItem(CARD_ORDERS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate that stored orders still match current devices
        const allDeviceIds = new Set(
          Object.values(devices)
            .flat()
            .map((d) => d.id)
        );
        safeCustomCards.forEach((card) => {
          allDeviceIds.add(card.id);
        });
        const isValid = Object.values(parsed).every(
          (orderArray: unknown) =>
            Array.isArray(orderArray) &&
            orderArray.every((id) => typeof id === 'string' && allDeviceIds.has(id))
        );
        if (isValid) {
          return parsed;
        }
      } catch {
        // Fall through to default
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
      let changed = false;

      Object.entries(prev).forEach(([room, order]) => {
        if (!Array.isArray(order)) {
          return;
        }

        const roomOrder = next[room] ?? [];
        const preserved = order.filter((id) => allDeviceIds.has(id));
        const additions = roomOrder.filter((id) => !preserved.includes(id));
        const merged = [...preserved, ...additions];

        if (
          merged.length !== roomOrder.length ||
          merged.some((id, index) => id !== roomOrder[index])
        ) {
          changed = true;
        }

        next[room] = merged;
      });

      const prevRooms = Object.keys(prev);
      if (!changed && prevRooms.length === Object.keys(next).length) {
        return prev;
      }

      return next;
    });
  }, [buildOrders, devices, safeCustomCards]);

  // Persist to localStorage whenever cardOrders changes
  useEffect(() => {
    localStorage.setItem(CARD_ORDERS_STORAGE_KEY, JSON.stringify(cardOrders));
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
