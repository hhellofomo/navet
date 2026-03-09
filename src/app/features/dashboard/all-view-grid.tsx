import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import type { AllViewGridProps } from './all-view-grid.types';
import { RoomSection } from './components/room-section';
import { useAllViewGrid } from './use-all-view-grid';

export const AllViewGrid = memo(function AllViewGrid({
  deviceMap,
  rooms,
  cardOrders,
  isEditMode,
  cardSizes,
  updateCardSize,
  customCards = [],
  onDeleteCard,
  onUpdateCard,
  onRemoveEntity,
  allowEntityRemoval = false,
  usesHideAction = false,
}: AllViewGridProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const { customCardMap, handleSizeChange, roomSections } = useAllViewGrid({
    cardOrders,
    customCards,
    deviceMap,
    rooms,
    updateCardSize,
  });

  const textColor = surface.textPrimary;
  const textSecondary = surface.textSecondary;

  return (
    <div className="space-y-8">
      {roomSections.map((section) => (
        <RoomSection
          key={section.room}
          room={section.room}
          orderedRoomIds={section.orderedRoomIds}
          totalItems={section.totalItems}
          textColor={textColor}
          textSecondary={textSecondary}
          isEditMode={isEditMode}
          cardSizes={cardSizes}
          deviceMap={deviceMap}
          customCardMap={customCardMap}
          handleSizeChange={handleSizeChange}
          onDeleteCard={onDeleteCard}
          onUpdateCard={onUpdateCard}
          onRemoveEntity={onRemoveEntity}
          allowEntityRemoval={allowEntityRemoval}
          usesHideAction={usesHideAction}
        />
      ))}
    </div>
  );
});
