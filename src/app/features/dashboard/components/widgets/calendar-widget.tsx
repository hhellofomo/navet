import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { useTheme } from '@/app/hooks';
import { getThemeColorValue } from '@/app/utils/theme-colors';

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

  const bgColor =
    theme === 'light' ? 'bg-white/70' : theme === 'contrast' ? 'bg-black/50' : 'bg-white/10';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary =
    theme === 'light' ? 'text-gray-600' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-300';
  const border = theme === 'light' ? 'border-gray-200/50' : 'border-white/10';

  const displayEvents =
    size === 'extra-small' || size === 'small'
      ? mockEvents.slice(0, 2)
      : size === 'medium'
        ? mockEvents.slice(0, 3)
        : mockEvents;

  return (
    <div
      className={`${bgColor} backdrop-blur-xl rounded-2xl p-4 border ${border} h-full flex flex-col`}
    >
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
          <h3 className={`text-sm font-semibold ${textPrimary}`}>Calendar</h3>
          <p className="text-[10px] text-gray-300 truncate mt-0.5">Widget</p>
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
              <p className={`text-sm font-medium ${textPrimary} truncate`}>{event.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className={`w-3 h-3 ${textSecondary}`} />
                <p className={`text-xs ${textSecondary}`}>
                  {event.time} • {event.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {size !== 'extra-small' && size !== 'small' && (
        <button
          type="button"
          className={`mt-4 w-full py-2 rounded-lg text-xs font-medium transition-colors ${textSecondary}`}
          style={{ backgroundColor: theme === 'light' ? '#f3f4f6' : 'rgba(255, 255, 255, 0.05)' }}
        >
          View All Events
        </button>
      )}
    </div>
  );
}
