import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, ChevronDown, Edit3, LayoutGrid, Lightbulb } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef, memo, useEffect, useRef, useState } from 'react';
import { InteractivePill } from '@/app/components/shared/interactive-pill';
import { getStickyBarSurfaceClass } from '@/app/components/shared/theme/sticky-bar-surface-tokens';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { ThemeDropdownContent } from '@/app/components/shared/theme-dropdown-content';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import type { AllViewGrouping } from '@/app/features/dashboard/all-view-grid';
import { useTheme } from '@/app/hooks';

interface RoomNavProps {
  rooms?: string[];
  activeRoom: string;
  onRoomChange: (room: string) => void;
  allViewGrouping?: AllViewGrouping;
  isEditMode: boolean;
  onAllViewGroupingChange?: (grouping: AllViewGrouping) => void;
  onToggleEditMode: () => void;
  onMoveRoom?: (activeRoom: string, overRoom: string) => void;
  onAddCard?: () => void;
  onAddEntity?: () => void;
  addEntityLabel?: string;
}

interface RoomNavItemProps {
  room: string;
  activeRoom: string;
  isEditMode: boolean;
  textSecondary: string;
  hoverBg: string;
  onRoomChange: (room: string) => void;
}

interface RoomNavMenuButtonProps {
  icon: typeof Lightbulb;
  label: string;
  textSecondary: string;
  className: string;
}

const ALL_VIEW_GROUPING_OPTIONS: Array<{ label: string; value: AllViewGrouping }> = [
  { label: 'Custom', value: 'custom' },
  { label: 'Room', value: 'room' },
  { label: 'Type', value: 'type' },
  { label: 'No Grouping', value: 'none' },
];

function useStickyActivation() {
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [isStickyActive, setIsStickyActive] = useState(false);

  useEffect(() => {
    const updateStickyState = () => {
      const node = stickyRef.current;
      if (!node) {
        return;
      }

      const stickyTop = Number.parseFloat(window.getComputedStyle(node).top) || 0;
      setIsStickyActive(node.getBoundingClientRect().top <= stickyTop + 0.5);
    };

    updateStickyState();
    window.addEventListener('scroll', updateStickyState, { passive: true });
    window.addEventListener('resize', updateStickyState);

    return () => {
      window.removeEventListener('scroll', updateStickyState);
      window.removeEventListener('resize', updateStickyState);
    };
  }, []);

  return { stickyRef, isStickyActive };
}

export const RoomNav = memo(function RoomNav({
  rooms = [],
  activeRoom,
  onRoomChange,
  allViewGrouping = 'custom',
  isEditMode,
  onAllViewGroupingChange,
  onToggleEditMode,
  onMoveRoom,
  onAddCard,
  onAddEntity,
  addEntityLabel = 'Add Entity',
}: RoomNavProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const { stickyRef, isStickyActive } = useStickyActivation();
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
  const dividerClass =
    theme === 'light' ? 'bg-gray-300/90' : theme === 'contrast' ? 'bg-white/30' : 'bg-white/14';
  const stickyOffset = 'calc(env(safe-area-inset-top, 0px) + 8px)';
  const stickyShellClass = getStickyBarSurfaceClass(theme, isStickyActive);
  const showAllViewGrouping = activeRoom === 'All' && onAllViewGroupingChange;
  const actionPillClassName = `flex items-center gap-2 rounded-lg p-2 px-3 transition-colors ${inactiveBg} ${hoverBg}`;
  const dropdownItemClassName = `rounded-xl px-3 py-2 ${surface.textPrimary} ${hoverBg}`;

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
    <div ref={stickyRef} className="sticky top-0 z-30" style={{ top: stickyOffset }}>
      <div className={isStickyActive ? stickyShellClass : ''}>
        <div className="flex items-center gap-1 md:gap-1.5">
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
            {isEditMode && showAllViewGrouping ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <RoomNavMenuButton
                    icon={LayoutGrid}
                    label="View"
                    textSecondary={textSecondary}
                    className={actionPillClassName}
                  />
                </DropdownMenuTrigger>
                <ThemeDropdownContent theme={theme} align="end">
                  <DropdownMenuLabel className={`px-3 py-2 text-xs font-medium ${textSecondary}`}>
                    Group By
                  </DropdownMenuLabel>
                  {ALL_VIEW_GROUPING_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={dropdownItemClassName}
                      onClick={() => onAllViewGroupingChange(option.value)}
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-2">
                        <span>{option.label}</span>
                      </span>
                      {allViewGrouping === option.value ? <Check className="h-4 w-4" /> : null}
                    </DropdownMenuItem>
                  ))}
                </ThemeDropdownContent>
              </DropdownMenu>
            ) : null}

            {isEditMode && (onAddEntity || onAddCard) ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <RoomNavMenuButton
                    icon={Lightbulb}
                    label="Add"
                    textSecondary={textSecondary}
                    className={actionPillClassName}
                  />
                </DropdownMenuTrigger>
                <ThemeDropdownContent theme={theme} align="end">
                  {onAddEntity ? (
                    <DropdownMenuItem className={dropdownItemClassName} onClick={onAddEntity}>
                      <Lightbulb className="h-4 w-4" />
                      {addEntityLabel}
                    </DropdownMenuItem>
                  ) : null}
                  {onAddCard ? (
                    <DropdownMenuItem className={dropdownItemClassName} onClick={onAddCard}>
                      <LayoutGrid className="h-4 w-4" />
                      Add Card
                    </DropdownMenuItem>
                  ) : null}
                </ThemeDropdownContent>
              </DropdownMenu>
            ) : null}

            {isEditMode ? (
              <div
                aria-hidden="true"
                className={`mx-1 h-6 w-px shrink-0 rounded-full ${dividerClass}`}
              />
            ) : null}

            <InteractivePill
              onClick={onToggleEditMode}
              active={isEditMode}
              intent="action"
              className={`flex items-center gap-2 rounded-lg p-2 px-3 transition-colors ${
                isEditMode ? 'shadow-sm' : `${inactiveBg} ${hoverBg}`
              }`}
            >
              {isEditMode ? (
                <>
                  <Check className="h-4 w-4 text-white" />
                  <span className="hidden text-xs font-medium text-white md:inline">
                    Done Editing
                  </span>
                </>
              ) : (
                <>
                  <Edit3 className={`h-4 w-4 ${textSecondary}`} />
                  <span className={`hidden text-xs font-medium md:inline ${textSecondary}`}>
                    Customize
                  </span>
                </>
              )}
            </InteractivePill>
          </div>
        </div>
      </div>
    </div>
  );
});

const RoomNavMenuButton = memo(
  forwardRef<HTMLButtonElement, RoomNavMenuButtonProps & ButtonHTMLAttributes<HTMLButtonElement>>(
    function RoomNavMenuButton({ icon: Icon, label, textSecondary, className, ...props }, ref) {
      return (
        <InteractivePill ref={ref} intent="action" className={className} {...props}>
          <Icon className={`h-4 w-4 ${textSecondary}`} />
          <span className={`hidden text-xs font-medium md:inline ${textSecondary}`}>{label}</span>
          <ChevronDown className={`h-3.5 w-3.5 ${textSecondary}`} />
        </InteractivePill>
      );
    }
  )
);

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
