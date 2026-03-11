import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, ChevronDown, Edit3, LayoutGrid, Lightbulb, type LucideIcon } from 'lucide-react';
import { memo, type ReactNode, useEffect, useRef, useState } from 'react';
import { InteractivePill } from '@/app/components/shared/interactive-pill';
import { getStickyBarSurfaceClass } from '@/app/components/shared/theme/sticky-bar-surface-tokens';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import {
  ThemeDropdownContent,
  ThemeDropdownSubContent,
} from '@/app/components/shared/theme-dropdown-content';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import type { AllViewGrouping } from '@/app/features/dashboard/all-view-grid.types';
import { useTheme } from '@/app/hooks';

interface RoomNavProps {
  rooms?: string[];
  activeRoom: string;
  onRoomChange: (room: string) => void;
  allViewGrouping?: AllViewGrouping;
  isEditMode: boolean;
  onAllViewGroupingChange?: (grouping: AllViewGrouping) => void;
  onExportConfig?: () => void;
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

interface DashboardMenuSubLabelProps {
  Icon: LucideIcon;
  label: string;
}

interface DashboardMenuSubmenuProps {
  theme: ReturnType<typeof useTheme>['theme'];
  triggerIcon: LucideIcon;
  triggerLabel: string;
  sectionLabel: string;
  children: ReactNode;
  triggerClassName: string;
  sectionLabelClassName: string;
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
  onExportConfig,
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
  const stickyOffset = 'calc(env(safe-area-inset-top, 0px) + 8px)';
  const stickyShellClass = getStickyBarSurfaceClass(theme, isStickyActive);
  const showAllViewGrouping = activeRoom === 'All' && onAllViewGroupingChange;
  const menuItemClass = `rounded-xl px-3 py-2 ${surface.textPrimary} ${hoverBg}`;
  const subTriggerClass = `rounded-xl px-3 py-2 ${surface.textPrimary} ${hoverBg}`;
  const menuLabelClass = `px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] ${surface.textMuted}`;

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InteractivePill
                  active={isEditMode}
                  intent="action"
                  className={`flex h-[30px] items-center justify-center rounded-lg px-2.5 py-1.5 transition-colors md:h-[38px] md:gap-2 md:px-3 md:py-2 ${
                    isEditMode ? 'shadow-sm' : `${inactiveBg} ${hoverBg}`
                  }`}
                >
                  {isEditMode ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <Edit3 className={`h-4 w-4 ${textSecondary}`} />
                  )}
                  <span
                    className={`hidden text-xs font-medium md:inline ${isEditMode ? 'text-white' : textSecondary}`}
                  >
                    Dashboard
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 ${isEditMode ? 'text-white' : textSecondary}`}
                  />
                </InteractivePill>
              </DropdownMenuTrigger>

              <ThemeDropdownContent theme={theme} align="end">
                {(onAddEntity || onAddCard) && (
                  <DashboardMenuSubmenu
                    theme={theme}
                    triggerIcon={Lightbulb}
                    triggerLabel="Add"
                    sectionLabel="Add"
                    triggerClassName={subTriggerClass}
                    sectionLabelClassName={menuLabelClass}
                  >
                    {onAddEntity ? (
                      <DropdownMenuItem className={menuItemClass} onClick={onAddEntity}>
                        <Lightbulb className="h-4 w-4" />
                        {addEntityLabel}
                      </DropdownMenuItem>
                    ) : null}
                    {onAddCard ? (
                      <DropdownMenuItem className={menuItemClass} onClick={onAddCard}>
                        <LayoutGrid className="h-4 w-4" />
                        Add Card
                      </DropdownMenuItem>
                    ) : null}
                  </DashboardMenuSubmenu>
                )}

                {showAllViewGrouping ? (
                  <DashboardMenuSubmenu
                    theme={theme}
                    triggerIcon={LayoutGrid}
                    triggerLabel="View"
                    sectionLabel="Grouping"
                    triggerClassName={subTriggerClass}
                    sectionLabelClassName={menuLabelClass}
                  >
                    {ALL_VIEW_GROUPING_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        className={menuItemClass}
                        onClick={() => onAllViewGroupingChange(option.value)}
                      >
                        <span className="flex min-w-0 flex-1 items-center gap-2">
                          <span>{option.label}</span>
                        </span>
                        {allViewGrouping === option.value ? <Check className="h-4 w-4" /> : null}
                      </DropdownMenuItem>
                    ))}
                  </DashboardMenuSubmenu>
                ) : null}

                {onAddEntity || onAddCard || showAllViewGrouping ? <DropdownMenuSeparator /> : null}

                <DashboardMenuSubmenu
                  theme={theme}
                  triggerIcon={Edit3}
                  triggerLabel="Edit"
                  sectionLabel="Edit"
                  triggerClassName={subTriggerClass}
                  sectionLabelClassName={menuLabelClass}
                >
                  <DropdownMenuItem className={menuItemClass} onClick={onToggleEditMode}>
                    <Edit3 className="h-4 w-4" />
                    {isEditMode ? 'Done Editing' : 'Edit Dashboard'}
                  </DropdownMenuItem>
                  {onExportConfig ? (
                    <DropdownMenuItem className={menuItemClass} onClick={onExportConfig}>
                      <LayoutGrid className="h-4 w-4" />
                      Export Config
                    </DropdownMenuItem>
                  ) : null}
                </DashboardMenuSubmenu>
              </ThemeDropdownContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
});

const DashboardMenuSubmenu = memo(function DashboardMenuSubmenu({
  theme,
  triggerIcon,
  triggerLabel,
  sectionLabel,
  children,
  triggerClassName,
  sectionLabelClassName,
}: DashboardMenuSubmenuProps) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={triggerClassName}>
        <DashboardMenuSubLabel Icon={triggerIcon} label={triggerLabel} />
      </DropdownMenuSubTrigger>
      <ThemeDropdownSubContent theme={theme} className="min-w-[220px]">
        <div className={sectionLabelClassName}>{sectionLabel}</div>
        {children}
      </ThemeDropdownSubContent>
    </DropdownMenuSub>
  );
});

const DashboardMenuSubLabel = memo(function DashboardMenuSubLabel({
  Icon,
  label,
}: DashboardMenuSubLabelProps) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
});

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
