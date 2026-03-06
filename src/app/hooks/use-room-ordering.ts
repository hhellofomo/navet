import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';

const ROOM_ORDER_STORAGE_KEY = 'ha-dashboard-room-order';

export const useRoomOrdering = (rooms: string[]) => {
  const [roomOrder, setRoomOrder] = useState<string[]>(() => {
    const stored = localStorage.getItem(ROOM_ORDER_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (
          Array.isArray(parsed) &&
          parsed.every((room) => typeof room === 'string')
        ) {
          const preserved = parsed.filter((room) => rooms.includes(room));
          const additions = rooms.filter((room) => !preserved.includes(room));
          return [...preserved, ...additions];
        }
      } catch {
        // Fall through to default room order.
      }
    }

    return rooms;
  });

  useEffect(() => {
    setRoomOrder((prev) => {
      const preserved = prev.filter((room) => rooms.includes(room));
      const additions = rooms.filter((room) => !preserved.includes(room));
      const next = [...preserved, ...additions];

      if (next.length === prev.length && next.every((room, index) => room === prev[index])) {
        return prev;
      }

      return next;
    });
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(ROOM_ORDER_STORAGE_KEY, JSON.stringify(roomOrder));
  }, [roomOrder]);

  const moveRoom = useCallback((activeRoom: string, overRoom: string) => {
    setRoomOrder((prev) => {
      const oldIndex = prev.indexOf(activeRoom);
      const newIndex = prev.indexOf(overRoom);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return prev;
      }

      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  return { roomOrder, moveRoom };
};
