import { CalendarDays } from 'lucide-react';
import { memo, useState } from 'react';
import {
  type CardSize,
  CardSizeSelector,
  isCompactCardSize,
} from '@/app/components/shared/card-size-selector';
import { EntityCardHeader } from '@/app/components/shared/entity-card-header';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { useTheme } from '@/app/hooks';
import { CalendarEventDialog } from './calendar/calendar-event-dialog';
import { CalendarLargeView } from './calendar/calendar-large-view';
import { CalendarMediumView } from './calendar/calendar-medium-view';
import { CalendarSettingsDialog } from './calendar/calendar-settings-dialog';
import { CalendarSmallView } from './calendar/calendar-small-view';
import type { CalendarEvent } from './calendar/types';
import { useCalendarCardSources } from './calendar/use-calendar-card-sources';
import { useCalendarData } from './calendar/use-calendar-data';
import { useCalendarTheme } from './calendar/use-calendar-theme';

interface CalendarCardProps {
  id?: string;
  name?: string;
  room?: string;
  events?: CalendarEvent[];
  inEditMode?: boolean;
  size?: CardSize;
  onSizeChange?: (size: CardSize) => void;
}

export const CalendarCard = memo(function CalendarCard({
  id,
  name = 'Family Calendar',
  events,
  inEditMode = false,
  size = 'medium',
  onSizeChange,
}: CalendarCardProps) {
  const { theme, colors } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const {
    availableCalendars,
    selectedCalendarIds,
    selectedCalendarLabel,
    selectedEvents,
    setSelectedCalendarIds,
    setViewMode,
    viewMode,
  } = useCalendarCardSources(id, events ?? []);
  const { monthName, dayNumber, dayName, sourceEvents, nextEvent, mediumEvents, largeEvents } =
    useCalendarData(selectedEvents);

  const {
    textPrimary,
    textSecondary,
    overlayBg,
    dividerColor,
    hoverBg,
    hoverText,
    dotColor,
    moreEventsColor,
  } = useCalendarTheme(theme);

  const isSmall = isCompactCardSize(size);
  const isMedium = size === 'medium';
  const canOpenSettings = !inEditMode;

  return (
    <>
      <div
        className={`
          relative group overflow-hidden
          h-full w-full rounded-3xl
          bg-gradient-to-br ${colors.calendar.gradient}
          backdrop-blur-xl border ${colors.calendar.border}
          ${theme === 'light' ? 'shadow-lg' : 'shadow-lg hover:shadow-xl'}
          transition-all duration-300
          ${inEditMode ? 'cursor-move' : 'cursor-pointer'}
        `}
      >
        {/* Glass overlay */}
        <div className={`absolute inset-0 ${overlayBg}`} />

        {/* Subtle glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colors.calendar.glow} to-transparent`}
        />

        {/* Content */}
        <div className="relative flex h-full flex-col p-4">
          {canOpenSettings ? (
            <button
              type="button"
              className="mb-3 block w-full text-left"
              onClick={(event) => {
                event.stopPropagation();
                setIsSettingsOpen(true);
              }}
            >
              <EntityCardHeader
                title={`${dayName}, ${monthName} ${dayNumber}`}
                subtitle={selectedCalendarLabel || name}
                size={size}
                leading={
                  <EntityCardHeaderIcon IconComponent={CalendarDays} isActive={true} size={size} />
                }
              />
            </button>
          ) : (
            <EntityCardHeader
              title={`${dayName}, ${monthName} ${dayNumber}`}
              subtitle={selectedCalendarLabel || name}
              size={size}
              leading={
                <EntityCardHeaderIcon IconComponent={CalendarDays} isActive={true} size={size} />
              }
            />
          )}

          {inEditMode && onSizeChange && (
            <CardSizeSelector currentSize={size} onSizeChange={onSizeChange} />
          )}

          {!nextEvent ? (
            <div className={`flex flex-1 items-center justify-center text-sm ${textSecondary}`}>
              No upcoming events
            </div>
          ) : isSmall ? (
            <CalendarSmallView
              nextEvent={nextEvent}
              mockEvents={sourceEvents}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
              moreEventsColor={moreEventsColor}
              onEventClick={setSelectedEvent}
            />
          ) : isMedium ? (
            <CalendarMediumView
              mediumEvents={mediumEvents}
              theme={theme}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
              hoverText={hoverText}
              dotColor={dotColor}
              hoverBg={hoverBg}
              dividerColor={dividerColor}
              onEventClick={setSelectedEvent}
            />
          ) : (
            <CalendarLargeView
              largeEvents={largeEvents}
              theme={theme}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
              hoverText={hoverText}
              dotColor={dotColor}
              hoverBg={hoverBg}
              dividerColor={dividerColor}
              onEventClick={setSelectedEvent}
            />
          )}
        </div>
      </div>

      <CalendarSettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        theme={theme}
        title={name}
        calendars={availableCalendars.map((calendar) => ({
          id: calendar.id,
          name: calendar.name,
          room: calendar.room,
        }))}
        selectedCalendarIds={selectedCalendarIds}
        onSelectedCalendarIdsChange={setSelectedCalendarIds}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <CalendarEventDialog
        event={selectedEvent}
        isOpen={selectedEvent !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEvent(null);
          }
        }}
        theme={theme}
      />
    </>
  );
});
