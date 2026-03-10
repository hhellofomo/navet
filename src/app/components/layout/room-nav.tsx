import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Edit3, LayoutGrid, Lightbulb } from 'lucide-react';
import { memo } from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';

interface RoomNavProps {
  rooms?: string[];
  activeRoom: string;
  onRoomChange: (room: string) => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onMoveRoom?: (activeRoom: string, overRoom: string) => void;
  onAddCard?: () => void;
  onAddEntity?: () => void;
  addEntityLabel?: string;
}

export const RoomNav = memo(function RoomNav({
  rooms = [],
  activeRoom,
  onRoomChange,
  isEditMode,
  onToggleEditMode,
  onMoveRoom,
  onAddCard,
  onAddEntity,
  addEntityLabel = 'Add Entity',
}: RoomNavProps) {
  const { theme, primaryColor } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const visibleRooms = ['All', ...rooms];
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const textSecondary = surface.textSecondary;
  const textPrimary = surface.textPrimary;
  const inactiveBg = surface.subtleBg;
  const hoverBg = surface.hoverBg;
  const border = surface.border;
  const dividerClass = theme === 'light' ? 'bg-gray-200' : surface.border;
  const activeColorValue = getThemeColorValue(primaryColor);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    if (active.id === 'All' || over.id === 'All') {
      return;
    }

    onMoveRoom?.(String(active.id), String(over.id));
  };

  return (
    <div className={`flex items-center gap-2 pb-4 md:pb-6 border-b ${border} mb-6 md:mb-8`}>
      <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleRooms} strategy={horizontalListSortingStrategy}>
            <div className="flex items-center gap-2 min-w-max">
              {visibleRooms.map((room) => (
                <RoomNavItem
                  key={room}
                  room={room}
                  activeRoom={activeRoom}
                  isEditMode={isEditMode}
                  textSecondary={textSecondary}
                  textPrimary={textPrimary}
                  hoverBg={hoverBg}
                  activeColorValue={activeColorValue}
                  onRoomChange={onRoomChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 pl-2">
        {isEditMode && onAddEntity && (
          <button
            type="button"
            onClick={onAddEntity}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 px-3 ${inactiveBg} ${hoverBg}`}
          >
            <Lightbulb className={`w-4 h-4 ${textSecondary}`} />
            <span className={`text-xs font-medium hidden md:inline ${textSecondary}`}>
              {addEntityLabel}
            </span>
          </button>
        )}

        {isEditMode && onAddCard && (
          <button
            type="button"
            onClick={onAddCard}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 px-3 ${inactiveBg} ${hoverBg}`}
          >
            <LayoutGrid className={`w-4 h-4 ${textSecondary}`} />
            <span className={`text-xs font-medium hidden md:inline ${textSecondary}`}>
              Add Card
            </span>
          </button>
        )}

        {isEditMode && <div aria-hidden="true" className={`mx-1 h-6 w-px ${dividerClass}`} />}

        <button
          type="button"
          onClick={onToggleEditMode}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 px-3 ${
            isEditMode ? 'text-white shadow-sm' : `${inactiveBg} ${hoverBg}`
          }`}
          style={isEditMode ? { backgroundColor: activeColorValue } : undefined}
        >
          {isEditMode ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span className="text-xs font-medium text-white">Done Editing</span>
            </>
          ) : (
            <>
              <Edit3 className={`w-4 h-4 ${textSecondary}`} />
              <span className={`text-xs font-medium ${textSecondary}`}>Customize</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
});

interface RoomNavItemProps {
  room: string;
  activeRoom: string;
  isEditMode: boolean;
  textSecondary: string;
  textPrimary: string;
  hoverBg: string;
  activeColorValue: string;
  onRoomChange: (room: string) => void;
}

const RoomNavItem = memo(function RoomNavItem({
  room,
  activeRoom,
  isEditMode,
  textSecondary,
  textPrimary,
  hoverBg,
  activeColorValue,
  onRoomChange,
}: RoomNavItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: room,
    disabled: !isEditMode || room === 'All',
  });

  return (
    <button
      type="button"
      ref={setNodeRef}
      onClick={() => onRoomChange(room)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: activeRoom === room ? activeColorValue : undefined,
      }}
      className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
        activeRoom === room ? 'text-white' : `${textSecondary} ${hoverBg} hover:${textPrimary}`
      } ${isEditMode && room !== 'All' ? 'cursor-move active:cursor-grabbing' : ''} ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...(isEditMode && room !== 'All' ? attributes : {})}
      {...(isEditMode && room !== 'All' ? listeners : {})}
    >
      {room}
    </button>
  );
});
