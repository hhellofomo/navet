// Function to darken a color for gradient
export const darkenColor = (color: string, amount: number): string => {
	const hex = color.replace('#', '');
	const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - amount);
	const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - amount);
	const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - amount);
	return `rgb(${r}, ${g}, ${b})`;
};

interface GradientColors {
	from?: string;
	to?: string;
	border: string;
	glow: string;
	customGradient?: string;
}

// Get gradient colors based on selected color and state
export const getGradientColors = (
	isOn: boolean,
	selectedColor: string | null,
	theme: 'dark' | 'light' | 'contrast' = 'dark'
): GradientColors => {
	if (!isOn) {
		return theme === 'light'
			? {
					from: 'from-gray-100/60',
					to: 'to-gray-200/40',
					border: 'border-gray-200/50',
					glow: 'transparent',
				}
			: {
					from: 'from-gray-900/20',
					to: 'to-gray-950/20',
					border: 'border-gray-500/10',
					glow: 'transparent',
				};
	}

	if (selectedColor) {
		if (theme === 'light') {
			// Light theme: use stronger saturation so custom colors pop through the frosted overlay
			return {
				from: '',
				to: '',
				border: 'border-orange-300/50',
				glow: selectedColor,
				customGradient: `linear-gradient(135deg, ${selectedColor}40 0%, ${selectedColor}55 100%)`,
			};
		}
		const darkColor = darkenColor(selectedColor, 100);
		const darkerColor = darkenColor(selectedColor, 130);
		return {
			from: '',
			to: '',
			border: 'border-white/10',
			glow: selectedColor,
			customGradient: `linear-gradient(135deg, ${darkColor}66 0%, ${darkerColor}66 100%)`,
		};
	}

	return theme === 'light'
		? {
				from: 'from-amber-100/90',
				to: 'to-orange-100/80',
				border: 'border-amber-300/60',
				glow: '#ff8800',
			}
		: {
				from: 'from-orange-900/40',
				to: 'to-orange-950/40',
				border: 'border-orange-500/20',
				glow: '#ff8800',
			};
};
