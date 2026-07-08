import { useState } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useTheme } from '@/app/hooks';
import { cardTemplates } from './templates';
import type { AddCardDialogContainerProps, CardType } from './types';
import { AddCardDialogView } from './view';

export function AddCardDialogContainer({
  open,
  onClose,
  onAddCard,
  currentRoom,
}: AddCardDialogContainerProps) {
  const { theme, primaryColor } = useTheme();
  const [selectedType, setSelectedType] = useState<CardType | null>(null);
  const [selectedSize, setSelectedSize] = useState<CardSize>('medium');
  const resolveColorValue = (color: string) => getThemeColorValue(color as typeof primaryColor);

  const handleAdd = () => {
    if (selectedType) {
      onAddCard(selectedType, selectedSize);
      onClose();
      setSelectedType(null);
      setSelectedSize('medium');
    }
  };

  const selectedTemplate = cardTemplates.find((t) => t.id === selectedType);

  return (
    <AddCardDialogView
      open={open}
      onClose={onClose}
      currentRoom={currentRoom}
      theme={theme}
      primaryColor={primaryColor}
      cardTemplates={cardTemplates}
      selectedType={selectedType}
      setSelectedType={setSelectedType}
      selectedSize={selectedSize}
      setSelectedSize={setSelectedSize}
      selectedTemplate={selectedTemplate}
      getColorValue={resolveColorValue}
      handleAdd={handleAdd}
    />
  );
}
