import type { ReactNode } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import type { TranslationKey } from '@/app/i18n';

export interface AddCardDialogContainerProps {
  open: boolean;
  onClose: () => void;
  onAddCard: (type: CardType, size: CardSize) => void;
  currentRoom: string;
}

export type CardType = 'rss' | 'photo' | 'note';

export interface CardTemplate {
  id: CardType;
  nameKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: ReactNode;
  defaultSize: CardSize;
}
