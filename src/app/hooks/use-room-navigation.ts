import { useCallback, useState } from 'react';

/**
 * Custom hook for managing room navigation state
 * Encapsulates active room selection logic
 */
export const useRoomNavigation = (defaultRoom: string) => {
	const [activeRoom, setActiveRoom] = useState(defaultRoom);

	const changeRoom = useCallback((room: string) => {
		setActiveRoom(room);
	}, []);

	return { activeRoom, changeRoom };
};
