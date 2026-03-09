import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/app/constants/storage-keys';
import { storage } from '@/app/utils/storage';

export const useRoomOrdering = (rooms: string[]) => {
  const [roomOrder, setRoomOrder] = useState<string[]>(() => {
    const stored = storage.get<string[] | null>(STORAGE_KEYS.roomOrder, null);
    if (Array.isArray(stored) && stored.every((room) => typeof room === 'string')) {
      const preserved = stored.filter((room) => rooms.includes(room));
      const additions = rooms.filter((room) => !preserved.includes(room));
      return [...preserved, ...additions];
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
    storage.set(STORAGE_KEYS.roomOrder, roomOrder);
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
