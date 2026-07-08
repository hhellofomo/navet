import { useMemo } from 'react';
import type { CalendarEvent } from './types';

// Mock calendar events
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    startTime: '09:00',
    endTime: '09:30',
    timeDisplay: '9:00 AM',
    type: 'call',
    color: 'bg-blue-500',
    attendees: 8,
  },
  {
    id: '2',
    title: 'Design Review',
    startTime: '10:30',
    endTime: '11:30',
    timeDisplay: '10:30 AM',
    location: 'Conference Room A',
    type: 'meeting',
    color: 'bg-purple-500',
    attendees: 5,
  },
  {
    id: '3',
    title: 'Lunch with Client',
    startTime: '12:00',
    endTime: '13:00',
    timeDisplay: '12:00 PM',
    location: 'Downtown Bistro',
    type: 'event',
    color: 'bg-green-500',
  },
  {
    id: '4',
    title: 'Product Demo',
    startTime: '14:00',
    endTime: '15:00',
    timeDisplay: '2:00 PM',
    type: 'call',
    color: 'bg-orange-500',
    attendees: 12,
  },
  {
    id: '5',
    title: 'Code Review Session',
    startTime: '15:30',
    endTime: '16:30',
    timeDisplay: '3:30 PM',
    location: 'Dev Hub',
    type: 'meeting',
    color: 'bg-indigo-500',
    attendees: 6,
  },
];

export function useCalendarData() {
  const currentDate = useMemo(() => new Date(), []);
  const monthName = useMemo(
    () => currentDate.toLocaleString('default', { month: 'long' }),
    [currentDate]
  );
  const dayNumber = useMemo(() => currentDate.getDate(), [currentDate]);
  const dayName = useMemo(
    () => currentDate.toLocaleString('default', { weekday: 'short' }),
    [currentDate]
  );

  const nextEvent = useMemo(() => mockEvents[0], []);
  const mediumEvents = useMemo(() => mockEvents.slice(0, 3), []);
  const largeEvents = useMemo(() => mockEvents.slice(0, 5), []);

  return {
    currentDate,
    monthName,
    dayNumber,
    dayName,
    nextEvent,
    mediumEvents,
    largeEvents,
    mockEvents,
  };
}
