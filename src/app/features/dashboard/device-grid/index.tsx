import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { memo, useCallback, useDeferredValue, useMemo } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { useSearch } from '@/app/hooks';
import { DashboardCardItem } from '../components/dashboard-card-item';
import { DashboardEditActions } from '../components/dashboard-edit-actions';
import type { DeviceGridProps } from './types';

/**
 * Device Grid Component
 * Renders the grid of device cards and custom widget cards with drag-and-drop support
 * Optimized with memo to prevent unnecessary re-renders
 */
export const DeviceGrid = memo(function DeviceGrid({
  orderedCardIds,
  deviceMap,
  isEditMode,
  cardSizes,
  updateCardSize,
  customCards = [],
  onDeleteCard,
  onUpdateCard,
  onRemoveEntity,
  allowEntityRemoval = false,
  usesHideAction = false,
}: DeviceGridProps) {
  const { isSearchActive, filteredDeviceIds } = useSearch();
  const deferredFilteredDeviceIds = useDeferredValue(filteredDeviceIds);

  const handleSizeChange = useCallback(
    (id: string, size: CardSize) => {
      updateCardSize(id, size);
    },
    [updateCardSize]
  );

  const filteredDeviceIdSet = useMemo(
    () => new Set(deferredFilteredDeviceIds),
    [deferredFilteredDeviceIds]
  );

  const displayedCardIds = useMemo(
    () =>
      isSearchActive ? orderedCardIds.filter((id) => filteredDeviceIdSet.has(id)) : orderedCardIds,
    [filteredDeviceIdSet, isSearchActive, orderedCardIds]
  );
  const customCardMap = useMemo(
    () => new Map(customCards.map((card) => [card.id, card])),
    [customCards]
  );

  // Combine device cards and custom widget cards using the shared ordering model.
  const allCards = useMemo(
    () =>
      displayedCardIds
        .map((id) => {
          const device = deviceMap.get(id);
          if (device) {
            return { type: 'device' as const, id };
          }

          const card = customCardMap.get(id);
          if (card) {
            return { type: 'widget' as const, card };
          }

          return null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    [customCardMap, deviceMap, displayedCardIds]
  );

  // Get all IDs for SortableContext
  const allCardIds = useMemo(
    () => allCards.map((item) => (item.type === 'device' ? item.id : item.card.id)),
    [allCards]
  );
  const gridContent = (
    <div className="grid w-full grid-flow-row-dense grid-cols-2 gap-2 auto-rows-[87px] md:grid-cols-4 md:gap-3 xl:grid-cols-6 lg:gap-4 2xl:grid-cols-8">
      {allCards.map((item) => {
        if (item.type === 'device') {
          const device = deviceMap.get(item.id);
          if (!device) return null;

          const size = cardSizes[device.id] || (device.size as CardSize);

          return (
            <DashboardCardItem
              key={device.id}
              id={device.id}
              device={device}
              size={size}
              isEditMode={isEditMode}
              handleSizeChange={handleSizeChange}
              onRemoveEntity={onRemoveEntity}
              allowEntityRemoval={allowEntityRemoval}
              usesHideAction={usesHideAction}
            />
          );
        }

        const { card } = item;
        const size = cardSizes[card.id] || card.size;

        return (
          <DashboardCardItem
            key={card.id}
            id={card.id}
            card={card}
            size={size}
            isEditMode={isEditMode}
            handleSizeChange={handleSizeChange}
            onDeleteCard={onDeleteCard}
            onUpdateCard={onUpdateCard}
            onRemoveEntity={onRemoveEntity}
            allowEntityRemoval={allowEntityRemoval}
            usesHideAction={usesHideAction}
          />
        );
      })}
    </div>
  );
  return (
    <DashboardEditActions
      isEditMode={isEditMode}
      onDeleteCard={onDeleteCard}
      onRemoveEntity={onRemoveEntity}
      onSizeChange={handleSizeChange}
    >
      {isEditMode ? (
        <SortableContext items={allCardIds} strategy={rectSortingStrategy}>
          {gridContent}
        </SortableContext>
      ) : (
        gridContent
      )}
    </DashboardEditActions>
  );
});

export type { DeviceGridProps } from './types';
