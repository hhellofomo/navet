import { CalendarEventItem } from './calendar-event-item';
import type { CalendarEvent } from './types';

interface CalendarMediumViewProps {
  mediumEvents: CalendarEvent[];
  theme: 'light' | 'dark' | 'contrast';
  textPrimary: string;
  textSecondary: string;
  hoverText: string;
  dotColor: string;
  hoverBg: string;
  dividerColor: string;
}

export function CalendarMediumView({
  mediumEvents,
  theme,
  textPrimary,
  textSecondary,
  hoverText,
  dotColor,
  hoverBg,
  dividerColor,
}: CalendarMediumViewProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="space-y-2.5">
        {mediumEvents.map((event, index) => (
          <div key={event.id}>
            <CalendarEventItem
              event={event}
              theme={theme}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
              hoverText={hoverText}
              dotColor={dotColor}
              hoverBg={hoverBg}
            />
            {index < mediumEvents.length - 1 && <div className={`h-px ${dividerColor} mt-2.5`} />}
          </div>
        ))}
      </div>
    </div>
  );
}
