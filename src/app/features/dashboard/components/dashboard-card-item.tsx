import { EyeOff, X } from 'lucide-react';
import { memo } from 'react';
import { CardEditActionButton } from '@/app/components/shared/card-edit-action-button';
import { type CardSize, getCardSpanClass } from '@/app/components/shared/card-size-selector';
import { settingsSelectors } from '@/app/stores/selectors';
import { useSettingsStore } from '@/app/stores/settings-store';
import type { DeviceWithType } from '@/app/types/device.types';
import type { CustomCard } from '../stores/custom-cards-store';
import { renderCard } from '../utils/card-renderer';
import type { ZoneName } from '../zones/zone-types';
import { DashboardResizeTrigger } from './dashboard-edit-actions';
import { WidgetCard } from './widget-card';

interface DashboardCardItemProps {
  id: string;
  size: CardSize;
  isEditMode: boolean;
  handleSizeChange: (id: string, size: CardSize) => void;
  device?: DeviceWithType;
  card?: CustomCard;
  zone?: ZoneName;
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
  zone,
  onDeleteCard,
  onUpdateCard,
  onRemoveEntity,
  allowEntityRemoval = false,
  usesHideAction = false,
}: DashboardCardItemProps) {
  const ambientLightBleed = useSettingsStore(settingsSelectors.ambientLightBleed);
  const RemoveActionIcon = usesHideAction ? EyeOff : X;
  const removeAriaLabel = 'Remove entity from dashboard';
  const spanClass =
    device?.type === 'media' && size === 'large' ? 'col-span-1 row-span-4' : getCardSpanClass(size);
  const editControlSize = device?.type === 'media' && size === 'large' ? 'medium' : size;
  const allowedSizes = getAllowedSizes(device, card, zone);
  const cardContent = (
    <>
      {isEditMode && device && allowEntityRemoval && onRemoveEntity && (
        <CardEditActionButton
          cardSize={editControlSize}
          Icon={RemoveActionIcon}
          placement="top-left"
          variant={usesHideAction ? 'neutral' : 'destructive'}
          data-dashboard-edit-action="remove-entity"
          data-card-id={id}
          aria-label={removeAriaLabel}
        />
      )}
      {isEditMode && !device && card && onDeleteCard && (
        <CardEditActionButton
          cardSize={editControlSize}
          Icon={X}
          placement="top-left"
          variant="destructive"
          data-dashboard-edit-action="delete-card"
          data-card-id={id}
          aria-label="Delete widget"
        />
      )}
      {isEditMode ? (
        <DashboardResizeTrigger
          cardId={id}
          cardSize={size}
          triggerSize={editControlSize}
          allowedSizes={allowedSizes}
          cardType={device?.type ?? (card ? 'widget' : undefined)}
        />
      ) : null}
      {device
        ? renderCard({ device, size, handleSizeChange, isEditMode })
        : card && (
            <WidgetCard card={{ ...card, size }} isEditMode={isEditMode} onUpdate={onUpdateCard} />
          )}
    </>
  );

  return (
    <div
      className={`relative h-full ${device?.type === 'lights' && ambientLightBleed ? '[contain:layout_style]' : '[contain:layout_style_paint]'} ${spanClass}`}
      data-draggable-card="true"
    >
      {cardContent}
    </div>
  );
}, areDashboardCardItemPropsEqual);

function getAllowedSizes(device?: DeviceWithType, card?: CustomCard, zone?: ZoneName): CardSize[] {
  const heroAllowed = zone === 'hero' || zone === undefined;

  if (card) {
    if (heroAllowed && (card.type === 'photo' || card.type === 'rss')) {
      return ['small', 'medium', 'large', 'hero'];
    }
    return ['small', 'medium', 'large'];
  }

  switch (device?.type) {
    case 'media':
      return ['small', 'medium', 'large'];
    case 'grouped-sensors':
      return ['small', 'medium'];
    case 'calendars':
      return heroAllowed ? ['small', 'medium', 'large', 'hero'] : ['small', 'medium', 'large'];
    case 'weather':
      return heroAllowed ? ['large', 'hero'] : ['large'];
    case 'switches':
      return ['extra-small', 'small'];
    case 'locks':
      return [device.size as CardSize];
    default:
      return ['extra-small', 'small', 'medium', 'large'];
  }
}

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
    previous.zone === next.zone &&
    previous.handleSizeChange === next.handleSizeChange &&
    previous.onDeleteCard === next.onDeleteCard &&
    previous.onUpdateCard === next.onUpdateCard &&
    previous.onRemoveEntity === next.onRemoveEntity &&
    previous.allowEntityRemoval === next.allowEntityRemoval &&
    previous.usesHideAction === next.usesHideAction
  );
}
