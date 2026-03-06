import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { memo, useCallback } from 'react';
import { type CardSize, getCardSpanClass } from '@/app/components/shared/card-size-selector';
import { DraggableCard } from '@/app/components/shared/draggable-card';
import { useEditModeContext } from '../../contexts/edit-mode-context';
import { useSearch } from '../../contexts/search-context';
import type { CustomCard } from '../../hooks/use-custom-cards';
import type { DeviceWithType } from '../../types/device.types';
import { renderCard } from '../../utils/card-renderer';
import { WidgetCard } from './components/widget-card';

interface DeviceGridProps {
  orderedCardIds: string[];
  deviceMap: Map<string, DeviceWithType>;
  customCards?: CustomCard[];
  onDeleteCard?: (cardId: string) => void;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
}

/**
 * Device Grid Component
 * Renders the grid of device cards and custom widget cards with drag-and-drop support
 * Optimized with memo to prevent unnecessary re-renders
 */
export const DeviceGrid = memo(function DeviceGrid({
  orderedCardIds,
  deviceMap,
  customCards = [],
  onDeleteCard,
  onUpdateCard,
}: DeviceGridProps) {
  const { isEditMode, cardSizes, updateCardSize } = useEditModeContext();
  const { isSearchActive, filteredDeviceIds } = useSearch();

  const handleSizeChange = useCallback(
    (id: string, size: CardSize) => {
      updateCardSize(id, size);
    },
    [updateCardSize]
  );

  // Filter cards based on search
  const displayedCardIds = isSearchActive
    ? orderedCardIds.filter((id) => filteredDeviceIds.includes(id))
    : orderedCardIds;
  const customCardMap = new Map(customCards.map((card) => [card.id, card]));

  // Combine device cards and custom widget cards using the shared ordering model.
  const allCards = displayedCardIds
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
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // Get all IDs for SortableContext
  const allCardIds = allCards.map((item) => (item.type === 'device' ? item.id : item.card.id));

  return (
    <SortableContext items={allCardIds} strategy={rectSortingStrategy}>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-3 lg:gap-4 auto-rows-[180px] md:auto-rows-[190px]">
        {allCards.map((item, index) => {
          if (item.type === 'device') {
            const device = deviceMap.get(item.id);
            if (!device) return null;

            const size = cardSizes[device.id] || (device.size as CardSize);

            return (
              <DraggableCard
                key={device.id}
                id={device.id}
                index={index}
                isEditMode={isEditMode}
                className={getCardSpanClass(size)}
              >
                {renderCard({ device, size, handleSizeChange, isEditMode })}
              </DraggableCard>
            );
          } else {
            // Render custom widget card
            const { card } = item;
            const size = cardSizes[card.id] || card.size;

            return (
              <DraggableCard
                key={card.id}
                id={card.id}
                index={index}
                isEditMode={isEditMode}
                className={getCardSpanClass(size)}
              >
                <WidgetCard
                  card={{ ...card, size }}
                  onDelete={onDeleteCard}
                  onUpdate={onUpdateCard}
                />
              </DraggableCard>
            );
          }
        })}
      </div>
    </SortableContext>
  );
});
