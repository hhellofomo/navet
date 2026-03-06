import { Calendar as CalendarIcon, MapPin, Users, Video } from 'lucide-react';
import type { CalendarEvent } from './types';

interface CalendarEventItemProps {
	event: CalendarEvent;
	theme: 'light' | 'dark' | 'contrast';
	textPrimary: string;
	textSecondary: string;
	hoverText: string;
	dotColor: string;
	hoverBg: string;
	onItemClick?: () => void;
	showEndTime?: boolean;
}

export function CalendarEventItem({
	event,
	theme,
	textPrimary,
	textSecondary,
	hoverText,
	dotColor,
	hoverBg,
	onItemClick,
	showEndTime = false,
}: CalendarEventItemProps) {
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

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onItemClick?.();
		}
	};

	return (
		<button
			type="button"
			className={`group/item w-full text-left ${hoverBg} rounded-lg p-2 -m-2 transition-colors`}
			onClick={onItemClick}
			onKeyDown={handleKeyDown}
		>
			<div className="flex items-start gap-2.5">
				{/* Time */}
				<div className="w-14 flex-shrink-0 pt-0.5 text-left">
					<div className={`text-xs font-medium ${textPrimary}`}>{event.timeDisplay}</div>
					{showEndTime && (
						<div className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-white/50'}`}>
							{event.endTime}
						</div>
					)}
				</div>

				{/* Color bar */}
				<div
					className={`w-1 ${showEndTime ? 'self-stretch min-h-[44px]' : 'h-10'} ${event.color} rounded-full flex-shrink-0`}
				/>

				{/* Event details */}
				<div className="flex-1 min-w-0 text-left">
					<h3
						className={`text-sm font-semibold ${textPrimary} leading-tight mb-1 ${hoverText} transition-colors text-left`}
					>
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
								<span>
									{event.attendees} {event.attendees === 1 ? 'person' : 'people'}
								</span>
							</>
						)}
					</div>
				</div>
			</div>
		</button>
	);
}
