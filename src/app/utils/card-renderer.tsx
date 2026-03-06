import type { ReactElement } from 'react';
import type { CardSize } from '../components/shared/card-size-selector';
import { CalendarCard } from '../features/calendar/components/calendar-card';
import { ClimateCard } from '../features/climate/components/climate-card';
import { SwitchCard } from '../features/lighting/components/switch-card';
import { PowerCard } from '../features/power/components/power-card';
import { RSSFeedCard } from '../features/rss/components/rss-feed-card';
import { CoverCard } from '../features/security/components/cover-card';
import { LockCard } from '../features/security/components/lock-card';
import { GroupedSensorCard } from '../features/sensors/components/grouped-sensor-card';
import { SensorCard } from '../features/sensors/components/sensor-card';
import type { SensorReading } from '../features/sensors/components/sensors/sensor-types';
import { VacuumCard } from '../features/vacuum/components/vacuum-card';
import { WifiCard } from '../features/wifi/components/wifi-card';

interface DeviceData {
	id: string;
	type: string;
	[key: string]: string | number | boolean | object | undefined;
}

interface CardRendererOptions {
	device: DeviceData;
	size: CardSize;
	handleSizeChange: (id: string, size: CardSize) => void;
	isEditMode: boolean;
}

/**
 * Card renderer utility
 * Centralizes card rendering logic based on device type
 */
export const renderCard = ({
	device,
	size,
	handleSizeChange,
	isEditMode,
}: CardRendererOptions): ReactElement | null => {
	switch (device.type) {
		case 'climate':
			return (
				<ClimateCard
					id={device.id as string}
					name={device.name as string}
					temperature={device.temperature as number}
					mode={device.mode as string}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'power':
			return (
				<PowerCard
					percentage={device.percentage as number}
					usage={device.usage as string}
					cost={device.cost as string}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'wifi':
			return (
				<WifiCard
					networkName={device.networkName as string}
					speed={device.speed as number}
					uploadSpeed={device.uploadSpeed as string}
					downloadSpeed={device.downloadSpeed as string}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'switches':
			return (
				<SwitchCard
					name={device.name as string}
					initialState={device.state as boolean | undefined}
					power={device.power as number | undefined}
					voltage={device.voltage as number | undefined}
					energy={device.energy as number | undefined}
				/>
			);

		case 'covers':
			return (
				<CoverCard
					name={device.name as string}
					room={device.room as string}
					initialPosition={device.position as number | undefined}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'locks':
			return (
				<LockCard
					name={device.name as string}
					room={device.room as string}
					initialState={device.state as boolean | undefined}
				/>
			);

		case 'sensors':
			return (
				<SensorCard
					name={device.name as string}
					room={device.room as string}
					value={device.value as string}
					unit={device.unit as string}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'grouped-sensors':
			return (
				<GroupedSensorCard
					id={device.id as string}
					name={device.name as string}
					room={device.room as string}
					sensors={device.sensors as SensorReading[]}
					accentColor={
						device.accentColor as 'teal' | 'blue' | 'purple' | 'amber' | 'emerald' | undefined
					}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'vacuums':
			return (
				<VacuumCard
					id={device.id as string}
					name={device.name as string}
					room={device.room as string}
					status={device.status as 'cleaning' | 'returning' | 'docked' | 'paused' | 'idle'}
					battery={device.battery as number}
					cleanedArea={device.cleanedArea as string | undefined}
					cleaningTime={device.cleaningTime as string | undefined}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'rssFeeds':
			return (
				<RSSFeedCard
					inEditMode={isEditMode}
					size={size}
					onSizeChange={(newSize) => handleSizeChange(device.id, newSize)}
				/>
			);

		case 'calendars':
			return (
				<CalendarCard
					inEditMode={isEditMode}
					size={size}
					onSizeChange={(newSize) => handleSizeChange(device.id, newSize)}
				/>
			);

		default:
			return null;
	}
};
