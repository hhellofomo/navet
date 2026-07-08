import { format } from 'date-fns';

/**
 * Formats a temperature value with the appropriate unit symbol
 */
export function formatTemperature(
	value: number,
	unit: 'celsius' | 'fahrenheit' = 'fahrenheit'
): string {
	const rounded = Math.round(value);
	return unit === 'celsius' ? `${rounded}°C` : `${rounded}°F`;
}

/**
 * Formats a time with optional 24-hour format
 */
export function formatTime(date: Date, use24Hour: boolean = false): string {
	return format(date, use24Hour ? 'HH:mm' : 'h:mm a');
}

/**
 * Formats a date in a human-readable format
 */
export function formatDate(date: Date): string {
	return format(date, 'MMMM d, yyyy');
}

/**
 * Formats a date with time in 24-hour format (hours and minutes only)
 */
export function formatDateWithTime(date: Date): string {
	return format(date, 'MMMM d, yyyy HH:mm');
}

/**
 * Formats a date and time together
 */
export function formatDateTime(date: Date, use24Hour: boolean = false): string {
	return format(date, use24Hour ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy h:mm a');
}

/**
 * Formats a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) return 'just now';
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
	if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

	return formatDate(date);
}

/**
 * Formats a percentage value
 */
export function formatPercentage(value: number): string {
	return `${Math.round(value)}%`;
}

/**
 * Formats a number with comma separators
 */
export function formatNumber(value: number): string {
	return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Truncates text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(text: string): string {
	if (!text) return '';
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Converts a snake_case or kebab-case string to Title Case
 */
export function toTitleCase(text: string): string {
	return text
		.replace(/[_-]/g, ' ')
		.split(' ')
		.map((word) => capitalize(word))
		.join(' ');
}

/**
 * Calculates the week number for a given date
 */
export function getWeekNumber(date: Date): number {
	const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
