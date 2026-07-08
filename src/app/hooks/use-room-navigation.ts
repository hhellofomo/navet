import { useCallback } from 'react';
import { useNavigationStore } from '../stores/navigation-store';

/**
 * Custom hook for managing room navigation state
 * Encapsulates active room selection logic
 */
export const useRoomNavigation = (defaultRoom: string) => {
  const activeRoom = useNavigationStore((state) => state.currentRoom || defaultRoom);
  const setCurrentRoom = useNavigationStore((state) => state.setCurrentRoom);

  const changeRoom = useCallback(
    (room: string) => {
      setCurrentRoom(room);
    },
    [setCurrentRoom]
  );

  return { activeRoom, changeRoom };
};
