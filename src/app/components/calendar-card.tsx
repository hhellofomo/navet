import { memo, useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Users } from 'lucide-react';
import { CardSizeSelector, type CardSize } from './card-size-selector';
import { useTheme } from '../contexts/theme-context';

interface CalendarEvent {
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

interface CalendarCardProps {
  inEditMode?: boolean;
  size?: CardSize;
  onSizeChange?: (size: CardSize) => void;
}

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
    attendees: 8
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
    attendees: 5
  },
  {
    id: '3',
    title: 'Lunch with Client',
    startTime: '12:00',
    endTime: '13:00',
    timeDisplay: '12:00 PM',
    location: 'Downtown Bistro',
    type: 'event',
    color: 'bg-green-500'
  },
  {
    id: '4',
    title: 'Product Demo',
    startTime: '14:00',
    endTime: '15:00',
    timeDisplay: '2:00 PM',
    type: 'call',
    color: 'bg-orange-500',
    attendees: 12
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
    attendees: 6
  }
];

const currentDate = new Date();
const monthName = currentDate.toLocaleString('default', { month: 'long' });
const dayNumber = currentDate.getDate();
const dayName = currentDate.toLocaleString('default', { weekday: 'short' });

export const CalendarCard = memo(function CalendarCard({ 
  inEditMode = false,
  size = 'medium',
  onSizeChange
}: CalendarCardProps) {
  const { theme, colors } = useTheme();
  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  // Theme-aware colors
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-white/70';
  const overlayBg = theme === 'light' ? 'bg-white/60 backdrop-blur-sm' : 'bg-black/20 backdrop-blur-sm';
  const iconBg = theme === 'light' ? 'bg-indigo-100' : 'bg-white/10 backdrop-blur-sm';
  const iconColor = theme === 'light' ? 'text-indigo-600' : 'text-white';
  const dividerColor = theme === 'light' ? 'bg-gray-200' : 'bg-white/10';
  const hoverBg = theme === 'light' ? 'hover:bg-gray-100/80' : 'hover:bg-white/5';
  const hoverText = theme === 'light' ? 'group-hover/item:text-indigo-700' : 'group-hover/item:text-purple-100';
  const dotColor = theme === 'light' ? 'text-gray-300' : 'text-white/40';
  const moreEventsColor = theme === 'light' ? 'text-gray-500' : 'text-white/60';

  const nextEvent = mockEvents[0];
  const mediumEvents = mockEvents.slice(0, 3);
  const largeEvents = mockEvents.slice(0, 5);

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'call':
        return <Video className="w-3 h-3" />;
      case 'meeting':
        return <Users className="w-3 h-3" />;
      case 'event':
        return <CalendarIcon className="w-3 h-3" />;
    }
  };

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
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.calendar.glow} to-transparent`} />
      
      {/* Content */}
      <div className="relative h-full flex flex-col p-4">
        {/* Header */}
        <div className={`flex items-start justify-between ${isSmall ? 'mb-2' : 'mb-3'}`}>
          <div className="min-w-0 flex-1 text-left">
            <span className={`font-semibold ${textPrimary} text-sm text-left`}>{dayName}, {monthName} {dayNumber}</span>
          </div>
          
          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ml-2`}>
            <CalendarIcon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
        
        {inEditMode && onSizeChange && (
          <CardSizeSelector
            currentSize={size}
            onSizeChange={onSizeChange}
          />
        )}

        {isSmall ? (
          // Small: Next event with time
          <div className="flex-1 flex flex-col justify-between items-start text-left">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-1 h-12 ${nextEvent.color} rounded-full`} />
                <div className="flex-1 text-left">
                  <h3 className={`text-lg font-semibold ${textPrimary} leading-tight mb-1 text-left`}>
                    {nextEvent.title}
                  </h3>
                  <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}>
                    <Clock className="w-3 h-3" />
                    <span>{nextEvent.timeDisplay}</span>
                    {nextEvent.location && (
                      <>
                        <span className={dotColor}>•</span>
                        <span className="truncate">{nextEvent.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`text-xs ${moreEventsColor}`}>
              {mockEvents.length - 1} more events today
            </div>
          </div>
        ) : isMedium ? (
          // Medium: 3 upcoming events
          <div className="flex-1 overflow-hidden">
            <div className="space-y-2.5">
              {mediumEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`group/item cursor-pointer ${hoverBg} rounded-lg p-2 -m-2 transition-colors text-left`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Time */}
                    <div className="w-14 flex-shrink-0 pt-0.5 text-left">
                      <div className={`text-xs font-medium ${textPrimary}`}>
                        {event.timeDisplay}
                      </div>
                    </div>
                    
                    {/* Color bar */}
                    <div className={`w-1 h-10 ${event.color} rounded-full flex-shrink-0`} />
                    
                    {/* Event details */}
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className={`text-sm font-semibold ${textPrimary} leading-tight mb-1 ${hoverText} transition-colors text-left`}>
                        {event.title}
                      </h3>
                      <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}>
                        {getEventIcon(event.type)}
                        {event.location && (
                          <>
                            <span className="truncate">{event.location}</span>
                          </>
                        )}
                        {event.attendees && (
                          <>
                            {event.location && <span className={dotColor}>•</span>}
                            <span>{event.attendees} attendees</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < mediumEvents.length - 1 && (
                    <div className={`h-px ${dividerColor} mt-2.5`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Large: Full day schedule
          <div className="flex-1 overflow-hidden">
            <div className="space-y-2">
              {largeEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`group/item cursor-pointer ${hoverBg} rounded-lg p-2 -m-2 transition-colors text-left`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Time */}
                    <div className="w-14 flex-shrink-0 pt-0.5 text-left">
                      <div className={`text-xs font-medium ${textPrimary}`}>
                        {event.timeDisplay}
                      </div>
                      <div className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-white/50'}`}>
                        {event.endTime}
                      </div>
                    </div>
                    
                    {/* Color bar */}
                    <div className={`w-1 flex-shrink-0 ${event.color} rounded-full self-stretch min-h-[44px]`} />
                    
                    {/* Event details */}
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className={`text-sm font-semibold ${textPrimary} leading-tight mb-1 ${hoverText} transition-colors text-left`}>
                        {event.title}
                      </h3>
                      <div className={`flex flex-wrap items-center gap-1.5 text-xs ${textSecondary}`}>
                        <div className="flex items-center gap-1">
                          {getEventIcon(event.type)}
                          <span className="capitalize">{event.type}</span>
                        </div>
                        {event.location && (
                          <>
                            <span className={dotColor}>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </>
                        )}
                        {event.attendees && (
                          <>
                            <span className={dotColor}>•</span>
                            <span>{event.attendees} people</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < largeEvents.length - 1 && (
                    <div className={`h-px ${dividerColor} mt-2`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});