import type { ThemeType } from '../../contexts/theme-context';

interface CalendarThemeColors {
	textPrimary: string;
	textSecondary: string;
	overlayBg: string;
	iconBg: string;
	iconColor: string;
	dividerColor: string;
	hoverBg: string;
	hoverText: string;
	dotColor: string;
	moreEventsColor: string;
}

export function useCalendarTheme(theme: ThemeType): CalendarThemeColors {
	const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
	const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-white/70';
	const overlayBg =
		theme === 'light' ? 'bg-white/60 backdrop-blur-sm' : 'bg-black/20 backdrop-blur-sm';
	const iconBg = theme === 'light' ? 'bg-indigo-100' : 'bg-white/10 backdrop-blur-sm';
	const iconColor = theme === 'light' ? 'text-indigo-600' : 'text-white';
	const dividerColor = theme === 'light' ? 'bg-gray-200' : 'bg-white/10';
	const hoverBg = theme === 'light' ? 'hover:bg-gray-100/80' : 'hover:bg-white/5';
	const hoverText =
		theme === 'light' ? 'group-hover/item:text-indigo-700' : 'group-hover/item:text-purple-100';
	const dotColor = theme === 'light' ? 'text-gray-300' : 'text-white/40';
	const moreEventsColor = theme === 'light' ? 'text-gray-500' : 'text-white/60';

	return {
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
	};
}
