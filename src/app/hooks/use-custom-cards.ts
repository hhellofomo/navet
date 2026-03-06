import { useEffect, useState } from 'react';
import type { CardType } from '../components/add-card-dialog';

export interface CustomCard {
	id: string;
	type: CardType;
	size: 'small' | 'medium' | 'large';
	room: string;
	data?: Record<string, unknown>;
	createdAt: number;
}

const STORAGE_KEY = 'ha-dashboard-custom-cards';

function loadCustomCards(): CustomCard[] {
	if (typeof window === 'undefined') return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch (_error) {
		return [];
	}
}

function saveCustomCards(cards: CustomCard[]): void {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
	} catch (_error) {}
}

export function useCustomCards() {
	const [customCards, setCustomCards] = useState<CustomCard[]>(loadCustomCards);

	// Save to localStorage whenever cards change
	useEffect(() => {
		saveCustomCards(customCards);
	}, [customCards]);

	const addCard = (
		type: CardType,
		size: 'small' | 'medium' | 'large',
		room: string,
		data?: Record<string, unknown>
	) => {
		const newCard: CustomCard = {
			id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			type,
			size,
			room,
			data,
			createdAt: Date.now(),
		};

		setCustomCards((prev) => [...prev, newCard]);
		return newCard;
	};

	const removeCard = (cardId: string) => {
		setCustomCards((prev) => prev.filter((card) => card.id !== cardId));
	};

	const updateCard = (cardId: string, updates: Partial<Omit<CustomCard, 'id' | 'createdAt'>>) => {
		setCustomCards((prev) =>
			prev.map((card) => (card.id === cardId ? { ...card, ...updates } : card))
		);
	};

	const getCardsForRoom = (room: string): CustomCard[] => {
		if (room === 'All') {
			return customCards;
		}
		return customCards.filter((card) => card.room === room || card.room === 'All');
	};

	return {
		customCards,
		addCard,
		removeCard,
		updateCard,
		getCardsForRoom,
	};
}
