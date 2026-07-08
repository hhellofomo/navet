import { useI18n } from '@/app/hooks';
import { CalendarEventItem } from './calendar-event-item';
import { getCalendarDateParts } from './calendar-formatters';
import type { CalendarEvent, CalendarEventGroup } from './types';

interface CalendarDateRailProps {
  date: Date | null;
  textPrimary: string;
  textSecondary: string;
}

interface CalendarAgendaListProps {
  dayGroups: CalendarEventGroup[];
  textPrimary: string;
  textSecondary: string;
  hoverText: string;
  hoverBg: string;
  dividerColor?: string;
  onEventClick?: (event: CalendarEvent) => void;
}

export function CalendarDateRail({ date, textPrimary, textSecondary }: CalendarDateRailProps) {
  const { locale } = useI18n();
  const { weekdayShort, dayNumber, monthShort } = getCalendarDateParts(date, locale);

  return (
    <div className="flex w-[42px] flex-shrink-0 flex-col items-center pt-1 text-center">
      <div className={`text-[10px] uppercase tracking-[0.14em] ${textPrimary}`}>{weekdayShort}</div>
      <div className={`text-[15px] font-semibold leading-none ${textPrimary}`}>{dayNumber}</div>
      <div className={`mt-0.5 text-[10px] uppercase tracking-[0.14em] ${textSecondary}`}>
        {monthShort.toUpperCase()}
      </div>
    </div>
  );
}

export function CalendarAgendaList({
  dayGroups,
  textPrimary,
  textSecondary,
  hoverText,
  hoverBg,
  dividerColor,
  onEventClick,
}: CalendarAgendaListProps) {
  return (
    <div className="space-y-3 pb-1">
      {dayGroups.map((group, groupIndex) => (
        <div key={group.key}>
          <div className="flex items-start gap-3">
            <CalendarDateRail
              date={group.date}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />

            <div className="min-w-0 flex-1">
              <div className="space-y-1">
                {group.events.map((event, eventIndex) => (
                  <div key={event.id}>
                    <CalendarEventItem
                      event={event}
                      textPrimary={textPrimary}
                      textSecondary={textSecondary}
                      hoverText={hoverText}
                      hoverBg={hoverBg}
                      onItemClick={() => onEventClick?.(event)}
                    />
                    {dividerColor && eventIndex < group.events.length - 1 ? (
                      <div className={`ml-3 mt-1 h-px ${dividerColor}`} />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {dividerColor && groupIndex < dayGroups.length - 1 ? (
            <div className={`mt-3 h-px ${dividerColor}`} />
          ) : null}
        </div>
      ))}
    </div>
  );
}
