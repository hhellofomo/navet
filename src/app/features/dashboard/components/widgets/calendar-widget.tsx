import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { type CardSize, isCompactCardSize } from '@/app/components/shared/card-size-selector';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useTheme } from '@/app/hooks';
import { getDashboardWidgetSurfaceTokens } from './widget-surface-tokens';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  color: string;
}

const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Team Meeting', time: '9:00 AM', date: 'Today', color: '#007AFF' },
  { id: '2', title: 'Lunch with Sarah', time: '12:30 PM', date: 'Today', color: '#34C759' },
  { id: '3', title: 'Doctor Appointment', time: '3:00 PM', date: 'Today', color: '#FF3B30' },
  { id: '4', title: 'Grocery Shopping', time: '10:00 AM', date: 'Tomorrow', color: '#FF9500' },
  { id: '5', title: 'Movie Night', time: '7:00 PM', date: 'Tomorrow', color: '#AF52DE' },
];

interface CalendarWidgetProps {
  size?: CardSize;
}

export function CalendarWidget({ size = 'medium' }: CalendarWidgetProps) {
  const { theme, primaryColor } = useTheme();
  const surface = getDashboardWidgetSurfaceTokens(theme);
  const isCompact = isCompactCardSize(size);

  const displayEvents = isCompact
    ? mockEvents.slice(0, 2)
    : size === 'medium'
      ? mockEvents.slice(0, 3)
      : mockEvents;

  return (
    <div className={`${surface.panelClassName} h-full flex flex-col`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: `${getThemeColorValue(primaryColor)}20`,
            color: getThemeColorValue(primaryColor),
          }}
        >
          <CalendarIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${surface.textPrimary}`}>Calendar</h3>
          <p className={`mt-0.5 truncate text-[10px] ${surface.textMuted}`}>Widget</p>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {displayEvents.map((event) => (
          <div key={event.id} className="flex items-start gap-3">
            <div
              className="w-1 h-12 rounded-full flex-shrink-0"
              style={{ backgroundColor: event.color }}
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${surface.textPrimary} truncate`}>{event.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className={`w-3 h-3 ${surface.textSecondary}`} />
                <p className={`text-xs ${surface.textSecondary}`}>
                  {event.time} • {event.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isCompact && (
        <button
          type="button"
          className={`mt-4 w-full rounded-lg py-2 text-xs font-medium transition-colors ${surface.textSecondary}`}
          style={{ backgroundColor: surface.subtleFill }}
        >
          View All Events
        </button>
      )}
    </div>
  );
}
