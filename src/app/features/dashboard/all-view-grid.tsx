import { memo, useCallback, useMemo } from 'react';
import { DraggableCard } from '../../components/draggable-card';
import { getCardSpanClass } from '../../components/card-size-selector';
import { renderCard } from '../../utils/card-renderer';
import { WidgetCard } from '../../components/widget-card';
import { useEditModeContext } from '../../contexts/edit-mode-context';
import { useSearch } from '../../contexts/search-context';
import { useTheme } from '../../contexts/theme-context';
import type { DeviceWithType } from '../../types/device.types';
import type { CustomCard } from '../../hooks/use-custom-cards';

interface AllViewGridProps {
  deviceMap: Map<string, DeviceWithType>;
  rooms: string[];
  customCards?: CustomCard[];
  onDeleteCard?: (cardId: string) => void;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
}

/**
 * All View Grid Component
 * Displays all entities and custom widgets grouped by room
 */
export const AllViewGrid = memo(function AllViewGrid({ 
  deviceMap,
  rooms,
  customCards = [],
  onDeleteCard,
  onUpdateCard
}: AllViewGridProps) {
  const { isEditMode, cardSizes, updateCardSize } = useEditModeContext();
  const { isSearchActive, filteredDeviceIds } = useSearch();
  const { theme } = useTheme();

  const handleSizeChange = useCallback((id: string, size: any) => {
    updateCardSize(id, size);
  }, [updateCardSize]);

  // Group devices by room
  const devicesByRoom = useMemo(() => {
    const grouped: Record<string, DeviceWithType[]> = {};
    
    deviceMap.forEach((device) => {
      // Filter by search if active
      if (isSearchActive && !filteredDeviceIds.includes(device.id)) {
        return;
      }

      const room = ('room' in device ? device.room : 'location' in device ? device.location : null) as string | null;
      if (room) {
        if (!grouped[room]) {
          grouped[room] = [];
        }
        grouped[room].push(device);
      }
    });
    
    return grouped;
  }, [deviceMap, isSearchActive, filteredDeviceIds]);

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

  const textColor = theme === 'light' ? 'text-gray-900' : theme === 'contrast' ? 'text-white' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-600' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-400';

  return (
    <div className="space-y-8">
      {rooms.map((room) => {
        const roomDevices = devicesByRoom[room] || [];
        const roomCustomCards = customCardsByRoom[room] || [];
        const totalItems = roomDevices.length + roomCustomCards.length;
        
        if (totalItems === 0) return null;

        return (
          <div key={room}>
            {/* Room Header */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-lg md:text-xl font-semibold ${textColor}`}>
                {room}
              </h2>
              <span className={`text-xs md:text-sm ${textSecondary}`}>
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Device and Widget Grid for this room */}
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-3 lg:gap-4 auto-rows-[180px] md:auto-rows-[190px]">
              {/* Render devices */}
              {roomDevices.map((device, index) => {
                const size = cardSizes[device.id];
                
                return (
                  <DraggableCard
                    key={device.id}
                    id={device.id}
                    index={index}
                    isEditMode={false} // Disable drag in All view
                    className={getCardSpanClass(size)}
                  >
                    {renderCard({ device, size, handleSizeChange, isEditMode })}
                  </DraggableCard>
                );
              })}
              
              {/* Render custom widgets */}
              {roomCustomCards.map((card, index) => {
                const size = cardSizes[card.id] || card.size;
                
                return (
                  <DraggableCard
                    key={card.id}
                    id={card.id}
                    index={roomDevices.length + index}
                    isEditMode={false} // Disable drag in All view
                    className={getCardSpanClass(size)}
                  >
                    <WidgetCard 
                      card={{ ...card, size }} 
                      onDelete={onDeleteCard}
                      onUpdate={onUpdateCard}
                    />
                  </DraggableCard>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});
