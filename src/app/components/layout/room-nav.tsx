import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Edit3, LayoutGrid, Lightbulb } from 'lucide-react';
import { memo } from 'react';
import { InteractivePill } from '@/app/components/shared/interactive-pill';
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
  const { theme } = useTheme();
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
  const inactiveBg = surface.subtleBg;
  const hoverBg = surface.hoverBg;
  const border = surface.border;
  const dividerClass = theme === 'light' ? 'bg-gray-200' : surface.border;
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
    <div
      className={`flex items-center gap-1 pb-4 md:gap-1.5 md:pb-6 border-b ${border} mb-6 md:mb-8`}
    >
      <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleRooms} strategy={horizontalListSortingStrategy}>
            <div className="flex items-center gap-1 min-w-max md:gap-1.5">
              {visibleRooms.map((room) => (
                <RoomNavItem
                  key={room}
                  room={room}
                  activeRoom={activeRoom}
                  isEditMode={isEditMode}
                  textSecondary={textSecondary}
                  hoverBg={hoverBg}
                  onRoomChange={onRoomChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 pl-1 md:gap-1.5 md:pl-1.5">
        {isEditMode && onAddEntity && (
          <InteractivePill
            onClick={onAddEntity}
            intent="action"
            className={`flex items-center gap-2 rounded-lg p-2 px-3 transition-colors ${inactiveBg} ${hoverBg}`}
          >
            <Lightbulb className={`w-4 h-4 ${textSecondary}`} />
            <span className={`text-xs font-medium hidden md:inline ${textSecondary}`}>
              {addEntityLabel}
            </span>
          </InteractivePill>
        )}

        {isEditMode && onAddCard && (
          <InteractivePill
            onClick={onAddCard}
            intent="action"
            className={`flex items-center gap-2 rounded-lg p-2 px-3 transition-colors ${inactiveBg} ${hoverBg}`}
          >
            <LayoutGrid className={`w-4 h-4 ${textSecondary}`} />
            <span className={`text-xs font-medium hidden md:inline ${textSecondary}`}>
              Add Card
            </span>
          </InteractivePill>
        )}

        {isEditMode && <div aria-hidden="true" className={`mx-1 h-6 w-px ${dividerClass}`} />}

        <InteractivePill
          onClick={onToggleEditMode}
          active={isEditMode}
          intent="action"
          className={`flex h-[30px] w-[30px] items-center justify-center rounded-lg p-1.5 transition-colors md:h-[38px] md:w-auto md:gap-2 md:px-3 md:py-2 ${
            isEditMode ? 'shadow-sm' : `${inactiveBg} ${hoverBg}`
          }`}
        >
          {isEditMode ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span className="hidden text-xs font-medium text-white md:inline">Done Editing</span>
            </>
          ) : (
            <>
              <Edit3 className={`w-4 h-4 ${textSecondary}`} />
              <span className={`hidden text-xs font-medium md:inline ${textSecondary}`}>
                Customize
              </span>
            </>
          )}
        </InteractivePill>
      </div>
    </div>
  );
});

interface RoomNavItemProps {
  room: string;
  activeRoom: string;
  isEditMode: boolean;
  textSecondary: string;
  hoverBg: string;
  onRoomChange: (room: string) => void;
}

const RoomNavItem = memo(function RoomNavItem({
  room,
  activeRoom,
  isEditMode,
  textSecondary,
  hoverBg,
  onRoomChange,
}: RoomNavItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: room,
    disabled: !isEditMode || room === 'All',
  });

  return (
    <InteractivePill
      ref={setNodeRef}
      active={activeRoom === room}
      onClick={() => onRoomChange(room)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
        activeRoom === room ? 'text-white' : `${textSecondary} ${hoverBg}`
      } ${isEditMode && room !== 'All' ? 'cursor-move active:cursor-grabbing' : ''} ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...(isEditMode && room !== 'All' ? attributes : {})}
      {...(isEditMode && room !== 'All' ? listeners : {})}
    >
      {room}
    </InteractivePill>
  );
});
