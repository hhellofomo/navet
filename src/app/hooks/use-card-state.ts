import { useCallback, useEffect, useState } from 'react';
import type { CardSize } from '../components/shared/card-size-selector';

interface Device {
	id: string;
	size: CardSize;
	[key: string]: string | number | boolean | CardSize | undefined;
}

const CARD_SIZES_STORAGE_KEY = 'ha-dashboard-card-sizes';

/**
 * Custom hook for managing card sizes across all devices
 * Encapsulates card size state management logic with localStorage persistence
 */
export const useCardState = (devices: Record<string, Device[]>) => {
	const [cardSizes, setCardSizes] = useState<Record<string, CardSize>>(() => {
		// Try to load from localStorage first
		const stored = localStorage.getItem(CARD_SIZES_STORAGE_KEY);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				// Fall through to default
			}
		}

		// Default: use sizes from devices
		return Object.fromEntries(
			Object.values(devices)
				.flat()
				.map((device) => [device.id, device.size])
		);
	});

	// Persist to localStorage whenever cardSizes changes
	useEffect(() => {
		localStorage.setItem(CARD_SIZES_STORAGE_KEY, JSON.stringify(cardSizes));
	}, [cardSizes]);

	const updateCardSize = useCallback((id: string, size: CardSize) => {
		setCardSizes((prev) => ({ ...prev, [id]: size }));
	}, []);

	return { cardSizes, updateCardSize };
};
