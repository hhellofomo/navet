import { useCallback, useEffect, useState } from 'react';

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
export const useCardOrdering = (devices: Record<string, Device[]>, rooms: string[]) => {
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

		// Default: build orders from devices
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
			orders[room] = roomCards;
		});

		return orders;
	});

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
