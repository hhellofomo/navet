import type { ReactNode } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';

export interface AddCardDialogContainerProps {
  open: boolean;
  onClose: () => void;
  onAddCard: (type: CardType, size: CardSize) => void;
  currentRoom: string;
}

export type CardType = 'calendar' | 'news' | 'photo' | 'note';

export interface CardTemplate {
  id: CardType;
  name: string;
  description: string;
  icon: ReactNode;
  defaultSize: CardSize;
}
