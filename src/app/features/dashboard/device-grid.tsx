import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { memo, useCallback, useDeferredValue, useMemo } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { useSearch } from '../../hooks';
import type { CustomCard } from '../../hooks/use-custom-cards';
import type { DeviceWithType } from '../../types/device.types';
import { DashboardCardItem } from './components/dashboard-card-item';

interface DeviceGridProps {
  orderedCardIds: string[];
  deviceMap: Map<string, DeviceWithType>;
  isEditMode: boolean;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
  customCards?: CustomCard[];
  onDeleteCard?: (cardId: string) => void;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  onRemoveEntity?: (entityId: string) => void;
  allowEntityRemoval?: boolean;
}

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

  return (
    <SortableContext items={allCardIds} strategy={rectSortingStrategy}>
      <div className="grid justify-start grid-flow-col-dense grid-cols-[repeat(auto-fit,190px)] gap-2 md:gap-3 lg:gap-4 auto-rows-[91px] md:auto-rows-[89px] lg:auto-rows-[87px]">
        {allCards.map((item, index) => {
          if (item.type === 'device') {
            const device = deviceMap.get(item.id);
            if (!device) return null;

            const size = cardSizes[device.id] || (device.size as CardSize);

            return (
              <DashboardCardItem
                key={device.id}
                id={device.id}
                index={index}
                device={device}
                size={size}
                isEditMode={isEditMode}
                handleSizeChange={handleSizeChange}
                onRemoveEntity={onRemoveEntity}
                allowEntityRemoval={allowEntityRemoval}
              />
            );
          } else {
            // Render custom widget card
            const { card } = item;
            const size = cardSizes[card.id] || card.size;

            return (
              <DashboardCardItem
                key={card.id}
                id={card.id}
                index={index}
                card={card}
                size={size}
                isEditMode={isEditMode}
                handleSizeChange={handleSizeChange}
                onDeleteCard={onDeleteCard}
                onUpdateCard={onUpdateCard}
                onRemoveEntity={onRemoveEntity}
                allowEntityRemoval={allowEntityRemoval}
              />
            );
          }
        })}
      </div>
    </SortableContext>
  );
});
