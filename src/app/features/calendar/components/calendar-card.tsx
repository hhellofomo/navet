import { memo } from 'react';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { useTheme } from '@/app/contexts/theme-context';
import { CalendarDateDisplay } from './calendar/calendar-date-display';
import { CalendarLargeView } from './calendar/calendar-large-view';
import { CalendarMediumView } from './calendar/calendar-medium-view';
import { CalendarSmallView } from './calendar/calendar-small-view';
import { useCalendarData } from './calendar/use-calendar-data';
import { useCalendarTheme } from './calendar/use-calendar-theme';

interface CalendarCardProps {
  inEditMode?: boolean;
  size?: CardSize;
  onSizeChange?: (size: CardSize) => void;
}

export const CalendarCard = memo(function CalendarCard({
  inEditMode = false,
  size = 'medium',
  onSizeChange,
}: CalendarCardProps) {
  const { theme, colors } = useTheme();
  const { monthName, dayNumber, dayName, nextEvent, mediumEvents, largeEvents, mockEvents } =
    useCalendarData();

  const {
    textPrimary,
    textSecondary,
    overlayBg,
    iconBg,
    iconColor,
    dividerColor,
    hoverBg,
    hoverText,
    dotColor,
    moreEventsColor,
  } = useCalendarTheme(theme);

  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const _isLarge = size === 'large';

  return (
    <div
      className={`
        relative group overflow-hidden
        h-full w-full rounded-3xl
        bg-gradient-to-br ${colors.calendar.gradient}
        backdrop-blur-xl border ${colors.calendar.border}
        ${theme === 'light' ? 'shadow-lg' : 'shadow-lg hover:shadow-xl'}
        transition-all duration-300
        ${inEditMode ? 'cursor-move' : 'cursor-default'}
      `}
    >
      {/* Glass overlay */}
      <div className={`absolute inset-0 ${overlayBg}`} />

      {/* Subtle glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.calendar.glow} to-transparent`}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col p-4">
        <CalendarDateDisplay
          theme={theme}
          textPrimary={textPrimary}
          iconBg={iconBg}
          iconColor={iconColor}
          dayName={dayName}
          monthName={monthName}
          dayNumber={dayNumber}
        />

        {inEditMode && onSizeChange && (
          <CardSizeSelector currentSize={size} onSizeChange={onSizeChange} />
        )}

        {isSmall ? (
          <CalendarSmallView
            nextEvent={nextEvent}
            mockEvents={mockEvents}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            moreEventsColor={moreEventsColor}
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
          />
        )}
      </div>
    </div>
  );
});
