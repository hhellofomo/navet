import type { PrimaryColor, ThemeMode } from './theme-store';

export type ThemeType = ThemeMode;

export interface ThemeState {
	theme: ThemeMode;
	primaryColor: PrimaryColor;
	wallpaper: string | null;
	setTheme: (theme: ThemeMode) => void;
	setPrimaryColor: (color: PrimaryColor) => void;
	setWallpaper: (wallpaper: string | null) => void;
}

export interface EditModeState {
	isEditMode: boolean;
	setEditMode: (isEditMode: boolean) => void;
	toggleEditMode: () => void;
}

export interface NavigationState {
	currentRoom: string;
	setCurrentRoom: (room: string) => void;
}

export interface SearchState {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	clearSearch: () => void;
}

interface UserSettings {
	username: string;
	email: string;
	showNotifications: boolean;
	showWeatherInHeader: boolean;
	use24HourTime: boolean;
	temperatureUnit: 'celsius' | 'fahrenheit';
	defaultView: 'all' | string;
	compactMode: boolean;
}

export interface SettingsState extends UserSettings {
	updateSettings: (settings: Partial<UserSettings>) => void;
	resetSettings: () => void;
}

export type CardType = 'calendar' | 'news' | 'weather' | 'photo' | 'note';

export interface CustomCard {
	id: string;
	type: CardType;
	size: 'small' | 'medium' | 'large';
	room: string;
	data?: Record<string, unknown>;
	createdAt: number;
}

export interface CustomCardsState {
	cards: CustomCard[];
	addCard: (
		type: CardType,
		size: 'small' | 'medium' | 'large',
		room: string,
		data?: Record<string, unknown>
	) => CustomCard;
	removeCard: (cardId: string) => void;
	updateCard: (cardId: string, updates: Partial<Omit<CustomCard, 'id' | 'createdAt'>>) => void;
	getCardsForRoom: (room: string) => CustomCard[];
}
