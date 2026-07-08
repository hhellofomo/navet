import { getLocaleForLanguage, resolveAppLanguage } from '@/app/i18n/config';
import { useSettingsStore } from '@/app/stores';

const getCurrentLocale = () => {
  const language = resolveAppLanguage(useSettingsStore.getState().language);
  return getLocaleForLanguage(language);
};

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
  return new Intl.DateTimeFormat(getCurrentLocale(), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24Hour,
  }).format(date);
}

/**
 * Formats a date in a human-readable format
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(getCurrentLocale(), {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats a date with time in 24-hour format (hours and minutes only)
 */
export function formatDateWithTime(date: Date): string {
  return new Intl.DateTimeFormat(getCurrentLocale(), {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Formats a date and time together
 */
export function formatDateTime(date: Date, use24Hour: boolean = false): string {
  return new Intl.DateTimeFormat(getCurrentLocale(), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24Hour,
  }).format(date);
}

/**
 * Formats a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(getCurrentLocale(), { numeric: 'auto' });

  if (diffInSeconds < 60) return formatter.format(0, 'second');
  if (diffInSeconds < 3600) return formatter.format(-Math.floor(diffInSeconds / 60), 'minute');
  if (diffInSeconds < 86400) return formatter.format(-Math.floor(diffInSeconds / 3600), 'hour');
  if (diffInSeconds < 604800) return formatter.format(-Math.floor(diffInSeconds / 86400), 'day');

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
  return new Intl.NumberFormat(getCurrentLocale()).format(value);
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
