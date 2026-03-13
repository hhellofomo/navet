import type { ThemeType } from '@/app/hooks/use-theme';
import { CalendarEventItem } from './calendar-event-item';
import type { CalendarEvent } from './types';

interface CalendarMediumViewProps {
  mediumEvents: CalendarEvent[];
  theme: ThemeType;
  textPrimary: string;
  textSecondary: string;
  hoverText: string;
  dotColor: string;
  hoverBg: string;
  dividerColor: string;
  onEventClick?: (event: CalendarEvent) => void;
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
  onEventClick,
}: CalendarMediumViewProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto pr-1">
      <div className="space-y-2.5 pb-1">
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
              onItemClick={() => onEventClick?.(event)}
            />
            {index < mediumEvents.length - 1 && <div className={`h-px ${dividerColor} mt-2.5`} />}
          </div>
        ))}
      </div>
    </div>
  );
}
