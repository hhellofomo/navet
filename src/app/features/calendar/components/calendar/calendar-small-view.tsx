import type { CalendarEvent } from './types';

interface CalendarSmallViewProps {
  nextEvent: CalendarEvent;
  mockEvents: CalendarEvent[];
  textPrimary: string;
  textSecondary: string;
  moreEventsColor: string;
}

export function CalendarSmallView({
  nextEvent,
  mockEvents,
  textPrimary,
  textSecondary,
  moreEventsColor,
}: CalendarSmallViewProps) {
  return (
    <div className="flex-1 flex flex-col justify-between items-start text-left">
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-1 h-12 ${nextEvent.color} rounded-full`} />
          <div className="flex-1 text-left">
            <h3 className={`text-lg font-semibold ${textPrimary} leading-tight mb-1 text-left`}>
              {nextEvent.title}
            </h3>
            <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}>
              <Clock className="w-3 h-3" />
              <span>{nextEvent.timeDisplay}</span>
              {nextEvent.location && <span className="truncate">{nextEvent.location}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className={`text-xs ${moreEventsColor}`}>{mockEvents.length - 1} more events today</div>
    </div>
  );
}
