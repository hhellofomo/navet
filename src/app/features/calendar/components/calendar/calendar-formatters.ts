import type { CalendarEvent } from './types';

export function formatCalendarEventTimeLabel(event: CalendarEvent) {
  if (event.isAllDay) {
    return 'All day';
  }

  if (event.startTime !== '--' && event.endTime !== '--') {
    return `${event.startTime} - ${event.endTime}`;
  }

  return event.timeDisplay;
}

export function getCalendarDateParts(date: Date | null) {
  if (!date) {
    return {
      weekdayShort: '--',
      dayNumber: '--',
      monthShort: '--',
    };
  }

  return {
    weekdayShort: date.toLocaleDateString([], { weekday: 'short' }),
    dayNumber: date.getDate().toString(),
    monthShort: date.toLocaleDateString([], { month: 'short' }),
  };
}

export function formatCalendarGroupLabel(date: Date | null) {
  const { weekdayShort, dayNumber, monthShort } = getCalendarDateParts(date);
  return `${weekdayShort}, ${dayNumber} ${monthShort}`;
}
