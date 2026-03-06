/**
 * Theme Context - Provides theme management for the dashboard
 * Updated to use Zustand for state management with localStorage persistence
 */
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useThemeStore } from '../stores/theme-store';

export type ThemeType = 'dark' | 'light' | 'contrast';
export type PrimaryColor =
	| 'orange'
	| 'blue'
	| 'green'
	| 'purple'
	| 'pink'
	| 'red'
	| 'yellow'
	| 'teal';

interface ThemeColors {
	// Card backgrounds
	light: {
		gradient: string;
		border: string;
		iconBg: string;
		glow: string;
	};
	hvac: {
		heating: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
		cooling: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
		off: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
	};
	media: {
		gradient: string;
		border: string;
	};
	switch: {
		on: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
		off: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
	};
	cover: {
		open: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
		closed: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
	};
	lock: {
		locked: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
		unlocked: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
	};
	person: {
		home: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
		away: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
	};
	sensor: {
		gradient: string;
		border: string;
		iconBg: string;
		accent: string;
		glow: string;
	};
	vacuum: {
		cleaning: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
		returning: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
		docked: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
		paused: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
		error: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
	};
	rss: {
		gradient: string;
		border: string;
		glow: string;
	};
	calendar: {
		gradient: string;
		border: string;
		glow: string;
	};
}

// Color mapping for Tailwind classes
const colorMap: Record<PrimaryColor, string> = {
	orange: 'orange',
	blue: 'blue',
	green: 'green',
	purple: 'purple',
	pink: 'pink',
	red: 'red',
	yellow: 'yellow',
	teal: 'teal',
};

// Generate theme colors dynamically based on primary color
const generateThemeColors = (themeType: ThemeType, primaryColor: PrimaryColor): ThemeColors => {
	const color = colorMap[primaryColor];

	if (themeType === 'dark') {
		return {
			light: {
				gradient: `from-${color}-900/90 to-${color}-950/95`,
				border: `border-${color}-700/30`,
				iconBg: `bg-${color}-500/20`,
				glow: `from-${color}-500/10`,
			},
			hvac: {
				heating: {
					gradient: 'from-orange-900/90 to-orange-950/95',
					border: 'border-orange-700/30',
					iconBg: 'bg-orange-500/20',
					accent: 'text-orange-400',
					glow: 'from-orange-500/10',
				},
				cooling: {
					gradient: 'from-cyan-900/90 to-cyan-950/95',
					border: 'border-cyan-700/30',
					iconBg: 'bg-cyan-500/20',
					accent: 'text-cyan-400',
					glow: 'from-cyan-500/10',
				},
				off: {
					gradient: 'from-gray-900/90 to-gray-950/95',
					border: 'border-gray-700/30',
					iconBg: 'bg-gray-500/20',
					accent: 'text-gray-400',
					glow: 'from-gray-500/10',
				},
			},
			media: {
				gradient: 'from-pink-500/10',
				border: 'border-pink-700/20',
			},
			switch: {
				on: {
					gradient: `from-${color}-900/90 to-${color}-950/95`,
					border: `border-${color}-700/30`,
					iconBg: `bg-${color}-500/20`,
					accent: `text-${color}-400`,
					glow: `from-${color}-500/10`,
				},
				off: {
					gradient: 'from-gray-900/90 to-gray-950/95',
					border: 'border-gray-700/30',
					iconBg: 'bg-gray-500/20',
					accent: 'text-gray-400',
					glow: 'from-gray-500/10',
				},
			},
			cover: {
				open: {
					gradient: `from-${color}-900/90 to-${color}-950/95`,
					border: `border-${color}-700/30`,
					iconBg: `bg-${color}-500/20`,
					accent: `text-${color}-400`,
					glow: `from-${color}-500/10`,
				},
				closed: {
					gradient: 'from-gray-900/90 to-gray-950/95',
					border: 'border-gray-700/30',
					iconBg: 'bg-gray-500/20',
					accent: 'text-gray-400',
					glow: 'from-gray-500/10',
				},
			},
			lock: {
				locked: {
					gradient: `from-${color}-900/90 to-${color}-950/95`,
					border: `border-${color}-700/30`,
					iconBg: `bg-${color}-500/20`,
					accent: `text-${color}-400`,
					glow: `from-${color}-500/10`,
				},
				unlocked: {
					gradient: 'from-red-900/90 to-red-950/95',
					border: 'border-red-700/30',
					iconBg: 'bg-red-500/20',
					accent: 'text-red-400',
					glow: 'from-red-500/10',
				},
			},
			person: {
				home: {
					gradient: `from-${color}-900/90 to-${color}-950/95`,
					border: `border-${color}-700/30`,
					iconBg: `bg-${color}-500/20`,
					accent: `text-${color}-400`,
					glow: `from-${color}-500/10`,
				},
				away: {
					gradient: 'from-gray-900/90 to-gray-950/95',
					border: 'border-gray-700/30',
					iconBg: 'bg-gray-500/20',
					accent: 'text-gray-400',
					glow: 'from-gray-500/10',
				},
			},
			sensor: {
				gradient: `from-${color}-900/90 to-${color}-950/95`,
				border: `border-${color}-700/30`,
				iconBg: `bg-${color}-500/20`,
				accent: `text-${color}-400`,
				glow: `from-${color}-500/10`,
			},
			vacuum: {
				cleaning: {
					gradient: `from-${color}-900/90 to-${color}-950/95`,
					border: `border-${color}-700/30`,
					iconBg: `bg-${color}-500/20`,
					accent: `text-${color}-400`,
					glow: `from-${color}-500/10`,
				},
				returning: {
					gradient: 'from-purple-900/90 to-purple-950/95',
					border: 'border-purple-700/30',
					iconBg: 'bg-purple-500/20',
					accent: 'text-purple-400',
					glow: 'from-purple-500/10',
				},
				docked: {
					gradient: `from-${color}-900/90 to-${color}-950/95`,
					border: `border-${color}-700/30`,
					iconBg: `bg-${color}-500/20`,
					accent: `text-${color}-400`,
					glow: `from-${color}-500/10`,
				},
				paused: {
					gradient: 'from-yellow-900/90 to-yellow-950/95',
					border: 'border-yellow-700/30',
					iconBg: 'bg-yellow-500/20',
					accent: 'text-yellow-400',
					glow: 'from-yellow-500/10',
				},
				error: {
					gradient: 'from-red-900/90 to-red-950/95',
					border: 'border-red-700/30',
					iconBg: 'bg-red-500/20',
					accent: 'text-red-400',
					glow: 'from-red-500/10',
				},
			},
			rss: {
				gradient: 'from-orange-900/90 via-red-950/95 to-red-950/95',
				border: 'border-orange-700/30',
				glow: 'from-orange-500/10',
			},
			calendar: {
				gradient: 'from-indigo-900/90 via-purple-950/95 to-purple-950/95',
				border: 'border-indigo-700/30',
				glow: 'from-indigo-500/10',
			},
		};
	} else if (themeType === 'light') {
		return {
			light: {
				gradient: `from-${color}-100/90 to-${color}-200/80`,
				border: `border-${color}-300/60`,
				iconBg: `bg-${color}-400/40`,
				glow: `from-${color}-300/30`,
			},
			hvac: {
				heating: {
					gradient: 'from-orange-200/95 to-orange-100/90',
					border: 'border-orange-300/60',
					iconBg: 'bg-orange-400/50',
					accent: 'text-orange-600',
					glow: 'from-orange-300/30',
				},
				cooling: {
					gradient: 'from-cyan-200/95 to-cyan-100/90',
					border: 'border-cyan-300/60',
					iconBg: 'bg-cyan-400/50',
					accent: 'text-cyan-600',
					glow: 'from-cyan-300/30',
				},
				off: {
					gradient: 'from-gray-100/90 to-gray-200/80',
					border: 'border-gray-300/60',
					iconBg: 'bg-gray-400/40',
					accent: 'text-gray-400',
					glow: 'from-gray-300/30',
				},
			},
			media: {
				gradient: 'from-white to-pink-50/60',
				border: 'border-gray-200/80',
			},
			switch: {
				on: {
					gradient: `from-${color}-50/95 to-${color}-100/90`,
					border: `border-${color}-200/70`,
					iconBg: `bg-${color}-200`,
					accent: `text-${color}-700`,
					glow: `from-${color}-100/50`,
				},
				off: {
					gradient: 'from-white to-gray-100/80',
					border: 'border-gray-200/80',
					iconBg: 'bg-gray-100',
					accent: 'text-gray-600',
					glow: 'from-gray-50/40',
				},
			},
			cover: {
				open: {
					gradient: `from-${color}-50/95 to-${color}-100/90`,
					border: `border-${color}-200/70`,
					iconBg: `bg-${color}-200`,
					accent: `text-${color}-700`,
					glow: `from-${color}-100/50`,
				},
				closed: {
					gradient: 'from-white to-gray-100/80',
					border: 'border-gray-200/80',
					iconBg: 'bg-gray-100',
					accent: 'text-gray-600',
					glow: 'from-gray-50/40',
				},
			},
			lock: {
				locked: {
					gradient: `from-${color}-50/95 to-${color}-100/90`,
					border: `border-${color}-200/70`,
					iconBg: `bg-${color}-200`,
					accent: `text-${color}-700`,
					glow: `from-${color}-100/50`,
				},
				unlocked: {
					gradient: 'from-red-50/95 to-red-100/90',
					border: 'border-red-200/70',
					iconBg: 'bg-red-200',
					accent: 'text-red-700',
					glow: 'from-red-100/50',
				},
			},
			person: {
				home: {
					gradient: `from-${color}-50/95 to-${color}-100/90`,
					border: `border-${color}-200/70`,
					iconBg: `bg-${color}-200`,
					accent: `text-${color}-700`,
					glow: `from-${color}-100/50`,
				},
				away: {
					gradient: 'from-white to-gray-100/80',
					border: 'border-gray-200/80',
					iconBg: 'bg-gray-100',
					accent: 'text-gray-600',
					glow: 'from-gray-50/40',
				},
			},
			sensor: {
				gradient: `from-${color}-50/95 to-${color}-100/90`,
				border: `border-${color}-200/70`,
				iconBg: `bg-${color}-200`,
				accent: `text-${color}-700`,
				glow: `from-${color}-100/50`,
			},
			vacuum: {
				cleaning: {
					gradient: `from-${color}-50/95 to-${color}-100/90`,
					border: `border-${color}-200/70`,
					iconBg: `bg-${color}-200`,
					accent: `text-${color}-700`,
					glow: `from-${color}-100/50`,
				},
				returning: {
					gradient: 'from-purple-50/95 to-purple-100/90',
					border: 'border-purple-200/70',
					iconBg: 'bg-purple-200',
					accent: 'text-purple-700',
					glow: 'from-purple-100/50',
				},
				docked: {
					gradient: `from-${color}-50/95 to-${color}-100/90`,
					border: `border-${color}-200/70`,
					iconBg: `bg-${color}-200`,
					accent: `text-${color}-700`,
					glow: `from-${color}-100/50`,
				},
				paused: {
					gradient: 'from-yellow-50/95 to-yellow-100/90',
					border: 'border-yellow-200/70',
					iconBg: 'bg-yellow-200',
					accent: 'text-yellow-700',
					glow: 'from-yellow-100/50',
				},
				error: {
					gradient: 'from-red-50/95 to-red-100/90',
					border: 'border-red-200/70',
					iconBg: 'bg-red-200',
					accent: 'text-red-700',
					glow: 'from-red-100/50',
				},
			},
			rss: {
				gradient: 'from-white to-orange-50/60',
				border: 'border-gray-200/80',
				glow: 'from-orange-50/30',
			},
			calendar: {
				gradient: 'from-white to-indigo-50/60',
				border: 'border-gray-200/80',
				glow: 'from-indigo-50/30',
			},
		};
	} else {
		// contrast theme
		return {
			light: {
				gradient: `from-${color}-500/60 to-${color}-600/60`,
				border: `border-${color}-400/40`,
				iconBg: `bg-${color}-500/40`,
				glow: `from-${color}-400/15`,
			},
			hvac: {
				heating: {
					gradient: 'from-orange-500/60 to-orange-600/60',
					border: 'border-orange-400/40',
					iconBg: 'bg-orange-500/40',
					accent: 'text-orange-300',
					glow: 'from-orange-400/15',
				},
				cooling: {
					gradient: 'from-cyan-500/60 to-cyan-600/60',
					border: 'border-cyan-400/40',
					iconBg: 'bg-cyan-500/40',
					accent: 'text-cyan-300',
					glow: 'from-cyan-400/15',
				},
				off: {
					gradient: 'from-gray-500/60 to-gray-600/60',
					border: 'border-gray-400/40',
					iconBg: 'bg-gray-500/40',
					accent: 'text-gray-300',
					glow: 'from-gray-400/15',
				},
			},
			media: {
				gradient: 'from-pink-500/20',
				border: 'border-pink-400/40',
			},
			switch: {
				on: {
					gradient: `from-${color}-500/60 to-${color}-600/60`,
					border: `border-${color}-400/40`,
					iconBg: `bg-${color}-500/40`,
					accent: `text-${color}-300`,
					glow: `from-${color}-400/15`,
				},
				off: {
					gradient: 'from-gray-500/60 to-gray-600/60',
					border: 'border-gray-400/40',
					iconBg: 'bg-gray-500/40',
					accent: 'text-gray-300',
					glow: 'from-gray-400/15',
				},
			},
			cover: {
				open: {
					gradient: `from-${color}-500/60 to-${color}-600/60`,
					border: `border-${color}-400/40`,
					iconBg: `bg-${color}-500/40`,
					accent: `text-${color}-300`,
					glow: `from-${color}-400/15`,
				},
				closed: {
					gradient: 'from-gray-500/60 to-gray-600/60',
					border: 'border-gray-400/40',
					iconBg: 'bg-gray-500/40',
					accent: 'text-gray-300',
					glow: 'from-gray-400/15',
				},
			},
			lock: {
				locked: {
					gradient: `from-${color}-500/60 to-${color}-600/60`,
					border: `border-${color}-400/40`,
					iconBg: `bg-${color}-500/40`,
					accent: `text-${color}-300`,
					glow: `from-${color}-400/15`,
				},
				unlocked: {
					gradient: 'from-red-500/60 to-red-600/60',
					border: 'border-red-400/40',
					iconBg: 'bg-red-500/40',
					accent: 'text-red-300',
					glow: 'from-red-400/15',
				},
			},
			person: {
				home: {
					gradient: `from-${color}-500/60 to-${color}-600/60`,
					border: `border-${color}-400/40`,
					iconBg: `bg-${color}-500/40`,
					accent: `text-${color}-300`,
					glow: `from-${color}-400/15`,
				},
				away: {
					gradient: 'from-gray-500/60 to-gray-600/60',
					border: 'border-gray-400/40',
					iconBg: 'bg-gray-500/40',
					accent: 'text-gray-300',
					glow: 'from-gray-400/15',
				},
			},
			sensor: {
				gradient: `from-${color}-500/60 to-${color}-600/60`,
				border: `border-${color}-400/40`,
				iconBg: `bg-${color}-500/40`,
				accent: `text-${color}-300`,
				glow: `from-${color}-400/15`,
			},
			vacuum: {
				cleaning: {
					gradient: `from-${color}-500/60 to-${color}-600/60`,
					border: `border-${color}-400/40`,
					iconBg: `bg-${color}-500/40`,
					accent: `text-${color}-300`,
					glow: `from-${color}-400/15`,
				},
				returning: {
					gradient: 'from-purple-500/60 to-purple-600/60',
					border: 'border-purple-400/40',
					iconBg: 'bg-purple-500/40',
					accent: 'text-purple-300',
					glow: 'from-purple-400/15',
				},
				docked: {
					gradient: `from-${color}-500/60 to-${color}-600/60`,
					border: `border-${color}-400/40`,
					iconBg: `bg-${color}-500/40`,
					accent: `text-${color}-300`,
					glow: `from-${color}-400/15`,
				},
				paused: {
					gradient: 'from-yellow-500/60 to-yellow-600/60',
					border: 'border-yellow-400/40',
					iconBg: 'bg-yellow-500/40',
					accent: 'text-yellow-300',
					glow: 'from-yellow-400/15',
				},
				error: {
					gradient: 'from-red-500/60 to-red-600/60',
					border: 'border-red-400/40',
					iconBg: 'bg-red-500/40',
					accent: 'text-red-300',
					glow: 'from-red-400/15',
				},
			},
			rss: {
				gradient: 'from-orange-500/60 via-red-600/60 to-red-600/60',
				border: 'border-orange-400/40',
				glow: 'from-orange-400/15',
			},
			calendar: {
				gradient: 'from-indigo-500/60 via-purple-600/60 to-purple-600/60',
				border: 'border-indigo-400/40',
				glow: 'from-indigo-400/15',
			},
		};
	}
};

interface ThemeContextValue {
	theme: ThemeType;
	setTheme: (theme: ThemeType) => void;
	colors: ThemeColors;
	primaryColor: PrimaryColor;
	setPrimaryColor: (color: PrimaryColor) => void;
	wallpaper: string | null;
	setWallpaper: (wallpaper: string | null) => void;
}

const defaultThemeValue: ThemeContextValue = {
	theme: 'dark',
	setTheme: () => {},
	colors: generateThemeColors('dark', 'orange'),
	primaryColor: 'orange',
	setPrimaryColor: () => {},
	wallpaper: null,
	setWallpaper: () => {},
};

export const ThemeContext = createContext<ThemeContextValue>(defaultThemeValue);

interface ThemeProviderProps {
	children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	// Use Zustand store as the source of truth
	const theme = useThemeStore((state) => state.theme);
	const primaryColor = useThemeStore((state) => state.primaryColor);
	const wallpaper = useThemeStore((state) => state.wallpaper);
	const setTheme = useThemeStore((state) => state.setTheme);
	const setPrimaryColor = useThemeStore((state) => state.setPrimaryColor);
	const setWallpaper = useThemeStore((state) => state.setWallpaper);

	// Memoize the colors to avoid unnecessary recalculations
	const colors = useMemo(() => generateThemeColors(theme, primaryColor), [theme, primaryColor]);

	const value: ThemeContextValue = {
		theme,
		setTheme,
		colors,
		primaryColor,
		setPrimaryColor,
		wallpaper,
		setWallpaper,
	};

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
	return useContext(ThemeContext);
}
