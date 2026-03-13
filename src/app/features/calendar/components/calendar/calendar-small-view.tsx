import { Clock } from 'lucide-react';
import type { CalendarEvent } from './types';

interface CalendarSmallViewProps {
  nextEvent: CalendarEvent;
  mockEvents: CalendarEvent[];
  textPrimary: string;
  textSecondary: string;
  moreEventsColor: string;
  onEventClick?: (event: CalendarEvent) => void;
}

export function CalendarSmallView({
  nextEvent,
  mockEvents,
  textPrimary,
  textSecondary,
  moreEventsColor,
  onEventClick,
}: CalendarSmallViewProps) {
  return (
    <div className="flex-1 flex flex-col justify-between items-start text-left">
      <div className="w-full">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-xl text-left transition-colors hover:bg-white/5"
          onClick={() => onEventClick?.(nextEvent)}
        >
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
        </button>
      </div>

      <div className={`text-xs ${moreEventsColor}`}>
        {Math.max(0, mockEvents.length - 1)} more events today
      </div>
    </div>
  );
}
