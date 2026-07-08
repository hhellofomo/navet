import { X } from 'lucide-react';
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
  onRemoveEntity?: (entityId: string) => void;
  allowEntityRemoval?: boolean;
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
  onRemoveEntity,
  allowEntityRemoval = false,
}: DashboardCardItemProps) {
  const isCompact = size === 'extra-small' || size === 'small';
  const removeButtonPosition = isCompact ? 'top-4 left-4' : 'top-5 left-5';
  const removeButtonSize = isCompact ? 'w-8 h-8' : 'w-10 h-10';
  const removeIconSize = isCompact ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <DraggableCard id={id} index={index} isEditMode={isEditMode} className={getCardSpanClass(size)}>
      {device && isEditMode && allowEntityRemoval && onRemoveEntity && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemoveEntity(id);
          }}
          className={`absolute ${removeButtonPosition} z-20 ${removeButtonSize} rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg`}
          aria-label="Remove entity from dashboard"
        >
          <X className={`${removeIconSize} text-white`} />
        </button>
      )}
      {device
        ? renderCard({ device, size, handleSizeChange, isEditMode })
        : card && (
            <WidgetCard
              card={{ ...card, size }}
              isEditMode={isEditMode}
              onDelete={onDeleteCard}
              onUpdate={onUpdateCard}
            />
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
    previous.onUpdateCard === next.onUpdateCard &&
    previous.onRemoveEntity === next.onRemoveEntity &&
    previous.allowEntityRemoval === next.allowEntityRemoval
  );
}
