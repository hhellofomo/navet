export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  timeDisplay: string;
  location?: string;
  type: 'meeting' | 'call' | 'event';
  color: string;
  attendees?: number;
}
