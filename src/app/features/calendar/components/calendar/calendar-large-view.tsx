import { CalendarEventItem } from './calendar-event-item';
import type { CalendarEvent } from './types';

interface CalendarLargeViewProps {
  largeEvents: CalendarEvent[];
  theme: 'light' | 'dark' | 'contrast';
  textPrimary: string;
  textSecondary: string;
  hoverText: string;
  dotColor: string;
  hoverBg: string;
  dividerColor: string;
}

export function CalendarLargeView({
  largeEvents,
  theme,
  textPrimary,
  textSecondary,
  hoverText,
  dotColor,
  hoverBg,
  dividerColor,
}: CalendarLargeViewProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="space-y-2">
        {largeEvents.map((event, index) => (
          <div key={event.id}>
            <CalendarEventItem
              event={event}
              theme={theme}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
              hoverText={hoverText}
              dotColor={dotColor}
              hoverBg={hoverBg}
              showEndTime
            />
            {index < largeEvents.length - 1 && <div className={`h-px ${dividerColor} mt-2`} />}
          </div>
        ))}
      </div>
    </div>
  );
}
