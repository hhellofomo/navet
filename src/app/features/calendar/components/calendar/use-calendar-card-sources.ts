import { useMemo } from 'react';
import { STORAGE_KEYS } from '@/app/constants/storage-keys';
import { useDevices, usePersistedState } from '@/app/hooks';
import type { CalendarEvent } from './types';

type PersistedCalendarSources = Record<string, string[]>;
type CalendarViewMode = 'week' | 'month';
type PersistedCalendarViewModes = Record<string, CalendarViewMode>;

export function useCalendarCardSources(cardId?: string, fallbackEvents: CalendarEvent[] = []) {
  const devices = useDevices();
  const [calendarSources, setCalendarSources] = usePersistedState<PersistedCalendarSources>(
    STORAGE_KEYS.calendarCardSources,
    {}
  );
  const [calendarViewModes, setCalendarViewModes] = usePersistedState<PersistedCalendarViewModes>(
    STORAGE_KEYS.calendarCardViewModes,
    {}
  );

  const availableCalendars = devices.calendars;

  const selectedCalendarIds = useMemo(() => {
    if (!cardId) {
      return [];
    }

    const stored = calendarSources[cardId];
    if (Array.isArray(stored) && stored.length > 0) {
      return stored;
    }

    return [cardId];
  }, [calendarSources, cardId]);
  const viewMode = useMemo<CalendarViewMode>(() => {
    if (!cardId) {
      return 'week';
    }

    return calendarViewModes[cardId] ?? 'week';
  }, [calendarViewModes, cardId]);

  const selectedEvents = useMemo(() => {
    if (!cardId) {
      return fallbackEvents;
    }

    const selectedIdSet = new Set(selectedCalendarIds);
    const matchedCalendars = availableCalendars.filter((calendar) =>
      selectedIdSet.has(calendar.id)
    );
    if (matchedCalendars.length === 0) {
      return fallbackEvents;
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + (viewMode === 'week' ? 7 : 31));

    return matchedCalendars
      .flatMap((calendar) => calendar.events)
      .filter((event) => {
        if (!event.sortKey) {
          return true;
        }

        const eventDate = new Date(event.sortKey);
        if (Number.isNaN(eventDate.getTime())) {
          return true;
        }

        return eventDate >= now && eventDate <= endDate;
      })
      .sort((left, right) => {
        const leftKey = left.sortKey ?? left.startTime;
        const rightKey = right.sortKey ?? right.startTime;
        return leftKey.localeCompare(rightKey);
      })
      .slice(0, viewMode === 'week' ? 7 : 12);
  }, [availableCalendars, cardId, fallbackEvents, selectedCalendarIds, viewMode]);

  const selectedCalendarLabel = useMemo(() => {
    const matchedCalendars = availableCalendars.filter((calendar) =>
      selectedCalendarIds.includes(calendar.id)
    );

    if (matchedCalendars.length === 1) {
      return matchedCalendars[0].name;
    }

    if (matchedCalendars.length > 1) {
      return `${matchedCalendars.length} Calendars`;
    }

    return 'Calendar';
  }, [availableCalendars, selectedCalendarIds]);

  const setSelectedCalendarIds = (nextIds: string[]) => {
    if (!cardId) {
      return;
    }

    setCalendarSources((current) => ({
      ...current,
      [cardId]: nextIds,
    }));
  };

  const setViewMode = (nextViewMode: CalendarViewMode) => {
    if (!cardId) {
      return;
    }

    setCalendarViewModes((current) => ({
      ...current,
      [cardId]: nextViewMode,
    }));
  };

  return {
    availableCalendars,
    selectedCalendarIds,
    selectedCalendarLabel,
    selectedEvents,
    setSelectedCalendarIds,
    setViewMode,
    viewMode,
  };
}
