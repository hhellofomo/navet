import { memo } from 'react';
import { type CardSize, getCardSpanClass } from '@/app/components/shared/card-size-selector';
import { DraggableCard } from '@/app/components/shared/draggable-card';
import type { CustomCard } from '@/app/hooks/use-custom-cards';
import type { DeviceWithType } from '@/app/types/device.types';
import { renderCard } from '@/app/utils/card-renderer';
import { WidgetCard } from './widget-card';

interface DashboardCardItemProps {
  id: string;
  index: number;
  size: CardSize;
  isEditMode: boolean;
  handleSizeChange: (id: string, size: CardSize) => void;
  device?: DeviceWithType;
  card?: CustomCard;
  onDeleteCard?: (cardId: string) => void;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
}

export const DashboardCardItem = memo(function DashboardCardItem({
  id,
  index,
  size,
  isEditMode,
  handleSizeChange,
  device,
  card,
  onDeleteCard,
  onUpdateCard,
}: DashboardCardItemProps) {
  return (
    <DraggableCard id={id} index={index} isEditMode={isEditMode} className={getCardSpanClass(size)}>
      {device
        ? renderCard({ device, size, handleSizeChange, isEditMode })
        : card && (
            <WidgetCard card={{ ...card, size }} onDelete={onDeleteCard} onUpdate={onUpdateCard} />
          )}
    </DraggableCard>
  );
}, areDashboardCardItemPropsEqual);

function areDashboardCardItemPropsEqual(
  previous: DashboardCardItemProps,
  next: DashboardCardItemProps
) {
  return (
    previous.id === next.id &&
    previous.index === next.index &&
    previous.size === next.size &&
    previous.isEditMode === next.isEditMode &&
    previous.device === next.device &&
    previous.card === next.card &&
    previous.handleSizeChange === next.handleSizeChange &&
    previous.onDeleteCard === next.onDeleteCard &&
    previous.onUpdateCard === next.onUpdateCard
  );
}
