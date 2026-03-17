import { Clock3, MapPin } from 'lucide-react';
import { useI18n } from '@/app/hooks';
import { formatCalendarEventTimeLabel } from './calendar-formatters';
import type { CalendarEvent } from './types';

interface CalendarEventItemProps {
  event: CalendarEvent;
  textPrimary: string;
  textSecondary: string;
  hoverText: string;
  hoverBg: string;
  onItemClick?: () => void;
  variant?: 'default' | 'compact';
}

export function CalendarEventItem({
  event,
  textPrimary,
  textSecondary,
  hoverText,
  hoverBg,
  onItemClick,
  variant = 'default',
}: CalendarEventItemProps) {
  const { t } = useI18n();
  const isCompact = variant === 'compact';
  const timeLabel = formatCalendarEventTimeLabel(event, t('calendar.allDay'));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onItemClick?.();
    }
  };

  return (
    <button
      type="button"
      className={`group/item flex w-full items-start gap-2 text-left transition-colors ${hoverBg} ${
        isCompact ? 'rounded-lg px-1 py-0.5' : 'rounded-xl px-1.5 py-1'
      }`}
      onClick={(uiEvent) => {
        uiEvent.stopPropagation();
        onItemClick?.();
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`${isCompact ? 'mt-0.5 h-8 w-0.5' : 'mt-0.5 w-px self-stretch'} rounded-full ${
          event.color
        }`}
      />

      <div className="min-w-0 flex-1">
        <div
          className={`min-w-0 font-semibold ${textPrimary} ${hoverText} transition-colors ${
            isCompact ? 'line-clamp-2 text-[11px] leading-3.5' : 'text-sm leading-4.5'
          }`}
        >
          {event.title}
        </div>

        <div
          className={`mt-0.5 flex flex-col ${textSecondary} ${
            isCompact ? 'gap-0.5 text-[10px]' : 'gap-0.5 text-[11px]'
          }`}
        >
          <span className="inline-flex items-center gap-1">
            <Clock3 className={`${isCompact ? 'h-2.5 w-2.5' : 'h-3 w-3'} flex-shrink-0`} />
            <span>{timeLabel}</span>
          </span>
          {event.location ? (
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className={`${isCompact ? 'h-2.5 w-2.5' : 'h-3 w-3'} flex-shrink-0`} />
              <span className="truncate">{event.location}</span>
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
