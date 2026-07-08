import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { memo, useEffect, useRef, useState } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import type { DeviceWithType } from '@/app/types/device.types';
import { DashboardCardItem } from '../components/dashboard-card-item';
import type { CustomCard } from '../stores/custom-cards-store';

interface RoomSectionProps {
  title: string;
  orderedIds: string[];
  totalItems: number;
  textColor: string;
  textSecondary: string;
  mutedTitle?: boolean;
  showHeader?: boolean;
  isEditMode: boolean;
  cardSizes: Record<string, CardSize>;
  deviceMap: Map<string, DeviceWithType>;
  customCardMap: Map<string, CustomCard>;
  handleSizeChange: (id: string, size: CardSize) => void;
  onDeleteCard?: (cardId: string) => void;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  onRemoveEntity?: (entityId: string) => void;
  allowEntityRemoval?: boolean;
  usesHideAction?: boolean;
}

export const RoomSection = memo(function RoomSection({
  title,
  orderedIds,
  totalItems,
  textColor,
  textSecondary,
  mutedTitle = false,
  showHeader = true,
  isEditMode,
  cardSizes,
  deviceMap,
  customCardMap,
  handleSizeChange,
  onDeleteCard,
  onUpdateCard,
  onRemoveEntity,
  allowEntityRemoval = false,
  usesHideAction = false,
}: RoomSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      setIsVisible(true);
      return;
    }

    const node = containerRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [isEditMode]);

  const estimatedRows = Math.max(1, Math.ceil(totalItems / 4));
  const placeholderHeight = estimatedRows * 120;

  return (
    <div
      ref={containerRef}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '800px',
      }}
    >
      <div className={showHeader ? 'mb-4 flex items-center gap-3' : ''}>
        {showHeader ? (
          <>
            <h2
              className={`text-lg md:text-xl font-semibold ${mutedTitle ? textSecondary : textColor}`}
            >
              {title}
            </h2>
            <span className={`text-xs md:text-sm ${textSecondary}`}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </>
        ) : null}
      </div>

      {isVisible ? (
        <SortableContext items={orderedIds} strategy={rectSortingStrategy}>
          <div className="grid w-full grid-flow-row-dense grid-cols-2 gap-2 auto-rows-[87px] md:grid-cols-4 md:gap-3 xl:grid-cols-6 lg:gap-4 2xl:grid-cols-8">
            {orderedIds.map((id) => {
              const device = deviceMap.get(id);
              if (device) {
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

              const card = customCardMap.get(id);
              if (!card) {
                return null;
              }

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
        </SortableContext>
      ) : (
        <div className="w-full" style={{ minHeight: `${placeholderHeight}px` }} />
      )}
    </div>
  );
});
