import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { useSearch, useTheme } from '../../hooks';
import type { CustomCard } from '../../hooks/use-custom-cards';
import type { DeviceWithType } from '../../types/device.types';
import { getDeviceRoomLabel, UNKNOWN_ROOM_LABEL } from '../../utils/device-location';
import { DashboardCardItem } from './components/dashboard-card-item';

interface AllViewGridProps {
  deviceMap: Map<string, DeviceWithType>;
  rooms: string[];
  cardOrders: Record<string, string[]>;
  isEditMode: boolean;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
  customCards?: CustomCard[];
  onDeleteCard?: (cardId: string) => void;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  onRemoveEntity?: (entityId: string) => void;
  allowEntityRemoval?: boolean;
  usesHideAction?: boolean;
}

interface RoomSectionProps {
  room: string;
  orderedRoomIds: string[];
  totalItems: number;
  theme: 'light' | 'dark' | 'contrast';
  textColor: string;
  textSecondary: string;
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

const RoomSection = memo(function RoomSection({
  room,
  orderedRoomIds,
  totalItems,
  theme,
  textColor,
  textSecondary,
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
      <div className="flex items-center gap-3 mb-4">
        <h2
          className={`text-lg md:text-xl font-semibold ${
            room === UNKNOWN_ROOM_LABEL
              ? theme === 'light'
                ? 'text-gray-700'
                : textColor
              : textColor
          }`}
        >
          {room}
        </h2>
        <span className={`text-xs md:text-sm ${textSecondary}`}>
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      {isVisible ? (
        <SortableContext items={orderedRoomIds} strategy={rectSortingStrategy}>
          <div className="grid w-full justify-start grid-flow-row-dense grid-cols-[repeat(auto-fit,190px)] gap-4 auto-rows-[87px]">
            {orderedRoomIds.map((id, index) => {
              const device = deviceMap.get(id);
              if (device) {
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
                    usesHideAction={usesHideAction}
                  />
                );
              }

              const card = customCardMap.get(id);
              if (!card) return null;

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

/**
 * All View Grid Component
 * Displays all entities and custom widgets grouped by room
 */
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
  const { isSearchActive, filteredDeviceIds } = useSearch();
  const { theme } = useTheme();
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

  // Group devices by room
  const devicesByRoom = useMemo(() => {
    const grouped: Record<string, DeviceWithType[]> = {};

    deviceMap.forEach((device) => {
      // Filter by search if active
      if (isSearchActive && !filteredDeviceIdSet.has(device.id)) {
        return;
      }

      const room = getDeviceRoomLabel(device);
      if (!grouped[room]) {
        grouped[room] = [];
      }
      grouped[room].push(device);
    });

    return grouped;
  }, [deviceMap, filteredDeviceIdSet, isSearchActive]);

  // Group custom cards by room
  const customCardsByRoom = useMemo(() => {
    const grouped: Record<string, CustomCard[]> = {};

    customCards.forEach((card) => {
      const room = card.room;
      if (room) {
        if (!grouped[room]) {
          grouped[room] = [];
        }
        grouped[room].push(card);
      }
    });

    return grouped;
  }, [customCards]);
  const customCardMap = useMemo(
    () => new Map(customCards.map((card) => [card.id, card])),
    [customCards]
  );

  const textColor =
    theme === 'light' ? 'text-gray-900' : theme === 'contrast' ? 'text-white' : 'text-white';
  const textSecondary =
    theme === 'light' ? 'text-gray-600' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-300';

  return (
    <div className="space-y-8">
      {rooms.map((room) => {
        const roomDevices = devicesByRoom[room] || [];
        const roomCustomCards = customCardsByRoom[room] || [];
        const totalItems = roomDevices.length + roomCustomCards.length;
        const orderedRoomIds = (cardOrders[room] || []).filter(
          (id) =>
            roomDevices.some((device) => device.id === id) ||
            roomCustomCards.some((card) => card.id === id)
        );

        if (totalItems === 0) return null;

        return (
          <RoomSection
            key={room}
            room={room}
            orderedRoomIds={orderedRoomIds}
            totalItems={totalItems}
            theme={theme}
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
        );
      })}
    </div>
  );
});
