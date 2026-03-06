import type { ThemeType } from '../../contexts/theme-context';

interface ClimateThemeColors {
	cardGradient: string;
	cardBorder: string;
	textPrimary: string;
	textSecondary: string;
	iconBg: string;
	iconColor: string;
	glowGradient: string;
	activeBtnBg: string;
	inactiveBtnBg: string;
}

export function useClimateTheme(theme: ThemeType): ClimateThemeColors {
	const cardGradient =
		theme === 'light' ? 'from-white to-purple-50/80' : 'from-purple-900/90 to-purple-950/95';
	const cardBorder = theme === 'light' ? 'border-gray-200/80' : 'border-purple-700/30';
	const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
	const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
	const iconBg = theme === 'light' ? 'bg-purple-100' : 'bg-purple-500/20';
	const iconColor = theme === 'light' ? 'text-purple-600' : 'text-purple-400';
	const glowGradient = theme === 'light' ? 'from-purple-50/40' : 'from-purple-500/5';
	const activeBtnBg = theme === 'light' ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white';
	const inactiveBtnBg =
		theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-white/5 text-gray-400';

	return {
		cardGradient,
		cardBorder,
		textPrimary,
		textSecondary,
		iconBg,
		iconColor,
		glowGradient,
		activeBtnBg,
		inactiveBtnBg,
	};
}
