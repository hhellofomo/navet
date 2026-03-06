import type { CardSize } from '../components/card-size-selector';

// Base device interface
export interface BaseDevice {
	id: string;
	name: string;
	size: CardSize;
}

// Light device
export interface LightDevice extends BaseDevice {
	room: string;
	state: boolean;
	brightness: number;
	temp: number;
}

// HVAC device
export interface HVACDevice extends BaseDevice {
	room: string;
	temp: number;
	mode: string;
}

// Climate device
export interface ClimateDevice extends BaseDevice {
	temperature: number;
	mode: string;
}

// Weather device
export interface WeatherDevice extends BaseDevice {
	room: string;
	temperature: number;
	location: string;
	condition: string;
	humidity: number;
	windSpeed: number;
	pressure: number;
	precipitation: number;
	sunrise: string;
	sunset: string;
	daylight: string;
	rainForecast: string;
	forecast: Array<{
		day: string;
		condition: string;
		high: number;
		low: number;
	}>;
}

// Power device
export interface PowerDevice extends BaseDevice {
	percentage: number;
	usage: number;
	cost: number;
}

// Media device
export interface MediaDevice extends BaseDevice {
	room: string;
	title: string;
	artist: string;
}

// WiFi device
export interface WiFiDevice extends BaseDevice {
	room: string;
	networkName: string;
	speed: number;
	uploadSpeed: string;
	downloadSpeed: string;
}

// Switch device
export interface SwitchDevice extends BaseDevice {
	room: string;
	state: boolean;
	power: number;
	voltage: number;
	energy: number;
}

// Cover device
export interface CoverDevice extends BaseDevice {
	room: string;
	position: number;
}

// Lock device
export interface LockDevice extends BaseDevice {
	room: string;
	state: boolean;
}

// Person device
export interface PersonDevice extends BaseDevice {
	location: string;
	state: 'home' | 'away';
}

// Sensor device
export interface SensorDevice extends BaseDevice {
	room: string;
	value: string;
	unit: string;
}

// Vacuum device
export interface VacuumDevice extends BaseDevice {
	room: string;
	status: 'cleaning' | 'returning' | 'docked' | 'paused' | 'idle';
	battery: number;
	cleanedArea?: string;
	cleaningTime?: string;
}

// RSS Feed device
export interface RSSFeedDevice extends BaseDevice {
	room: string;
}

// Calendar device
export interface CalendarDevice extends BaseDevice {
	room: string;
}

// Union type for all devices
export type Device =
	| LightDevice
	| HVACDevice
	| ClimateDevice
	| WeatherDevice
	| PowerDevice
	| MediaDevice
	| WiFiDevice
	| SwitchDevice
	| CoverDevice
	| LockDevice
	| PersonDevice
	| SensorDevice
	| VacuumDevice
	| RSSFeedDevice
	| CalendarDevice;

// Device collection
export interface DeviceCollection {
	lights: LightDevice[];
	hvac: HVACDevice[];
	climate: ClimateDevice[];
	power: PowerDevice[];
	media: MediaDevice[];
	weather: WeatherDevice[];
	wifi: WiFiDevice[];
	switches: SwitchDevice[];
	covers: CoverDevice[];
	locks: LockDevice[];
	persons: PersonDevice[];
	sensors: SensorDevice[];
	vacuums: VacuumDevice[];
	rssFeeds: RSSFeedDevice[];
	calendars: CalendarDevice[];
}

// Device with type information
export interface DeviceWithType extends Record<string, string | number | boolean | undefined> {
	id: string;
	type: keyof DeviceCollection;
}
