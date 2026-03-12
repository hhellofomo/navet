import { EyeOff, X } from 'lucide-react';
import { memo } from 'react';
import { CardEditActionButton } from '@/app/components/shared/card-edit-action-button';
import { type CardSize, getCardSpanClass } from '@/app/components/shared/card-size-selector';
import { DraggableCard } from '@/app/components/shared/draggable-card';
import type { DeviceWithType } from '@/app/types/device.types';
import type { CustomCard } from '../stores/custom-cards-store';
import { renderCard } from '../utils/card-renderer';
import { WidgetCard } from './widget-card';

interface DashboardCardItemProps {
  id: string;
  size: CardSize;
  isEditMode: boolean;
  handleSizeChange: (id: string, size: CardSize) => void;
  device?: DeviceWithType;
  card?: CustomCard;
  onDeleteCard?: (cardId: string) => void;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  onRemoveEntity?: (entityId: string) => void;
  allowEntityRemoval?: boolean;
  usesHideAction?: boolean;
}

export const DashboardCardItem = memo(function DashboardCardItem({
  id,
  size,
  isEditMode,
  handleSizeChange,
  device,
  card,
  onDeleteCard,
  onUpdateCard,
  onRemoveEntity,
  allowEntityRemoval = false,
  usesHideAction = false,
}: DashboardCardItemProps) {
  const RemoveActionIcon = usesHideAction ? EyeOff : X;
  const removeAriaLabel = 'Remove entity from dashboard';
  const spanClass =
    device?.type === 'media' && size === 'large' ? 'col-span-1 row-span-4' : getCardSpanClass(size);
  const editControlSize = device?.type === 'media' && size === 'large' ? 'medium' : size;

  return (
    <DraggableCard id={id} isEditMode={isEditMode} className={spanClass}>
      {device && isEditMode && allowEntityRemoval && onRemoveEntity && (
        <CardEditActionButton
          cardSize={editControlSize}
          Icon={RemoveActionIcon}
          placement="top-left"
          variant={usesHideAction ? 'neutral' : 'destructive'}
          onClick={(event) => {
            event.stopPropagation();
            onRemoveEntity(id);
          }}
          aria-label={removeAriaLabel}
        />
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
    previous.size === next.size &&
    previous.isEditMode === next.isEditMode &&
    previous.device === next.device &&
    previous.card === next.card &&
    previous.handleSizeChange === next.handleSizeChange &&
    previous.onDeleteCard === next.onDeleteCard &&
    previous.onUpdateCard === next.onUpdateCard &&
    previous.onRemoveEntity === next.onRemoveEntity &&
    previous.allowEntityRemoval === next.allowEntityRemoval &&
    previous.usesHideAction === next.usesHideAction
  );
}
