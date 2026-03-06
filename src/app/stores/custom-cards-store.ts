import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CardType = 'calendar' | 'news' | 'weather' | 'photo' | 'note';

export interface CustomCard {
  id: string;
  type: CardType;
  size: 'small' | 'medium' | 'large';
  room: string;
  data?: Record<string, unknown>;
  createdAt: number;
}

interface CustomCardsState {
  cards: CustomCard[];
  addCard: (
    type: CardType,
    size: 'small' | 'medium' | 'large',
    room: string,
    data?: Record<string, unknown>
  ) => CustomCard;
  removeCard: (cardId: string) => void;
  updateCard: (cardId: string, updates: Partial<Omit<CustomCard, 'id' | 'createdAt'>>) => void;
  getCardsForRoom: (room: string) => CustomCard[];
}

export const useCustomCardsStore = create<CustomCardsState>()(
  persist(
    (set, get) => ({
      cards: [],
      addCard: (type, size, room, data) => {
        const newCard: CustomCard = {
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type,
          size,
          room,
          data,
          createdAt: Date.now(),
        };

        set((state) => ({ cards: [...state.cards, newCard] }));
        return newCard;
      },
      removeCard: (cardId) => {
        set((state) => ({ cards: state.cards.filter((card) => card.id !== cardId) }));
      },
      updateCard: (cardId, updates) => {
        set((state) => ({
          cards: state.cards.map((card) => (card.id === cardId ? { ...card, ...updates } : card)),
        }));
      },
      getCardsForRoom: (room) => {
        const { cards } = get();
        if (room === 'All') {
          return cards;
        }
        return cards.filter((card) => card.room === room || card.room === 'All');
      },
    }),
    {
      name: 'ha-dashboard-custom-cards',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
