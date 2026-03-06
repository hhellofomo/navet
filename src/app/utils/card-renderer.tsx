import type { ReactElement } from 'react';
import { CalendarCard } from '../components/calendar-card';
import type { CardSize } from '../components/card-size-selector';
import { ClimateCard } from '../components/climate-card';
import { CoverCard } from '../components/cover-card';
import { GroupedSensorCard } from '../components/grouped-sensor-card';
import { HVACCard } from '../components/hvac-card/index';
import { LightCard } from '../components/light-card/index';
import { LockCard } from '../components/lock-card';
import { MediaCard } from '../components/media-card';
import { PersonCard } from '../components/person-card';
import { PowerCard } from '../components/power-card';
import { RSSFeedCard } from '../components/rss-feed-card';
import { SensorCard } from '../components/sensor-card';
import { SwitchCard } from '../components/switch-card';
import { VacuumCard } from '../components/vacuum-card';
import { WeatherCard } from '../components/weather-card';
import { WifiCard } from '../components/wifi-card';

interface DeviceData {
	id: string;
	type: string;
	[key: string]: any;
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
		case 'lights':
			return (
				<LightCard
					id={device.id}
					name={device.name}
					room={device.room}
					initialState={device.state}
					initialBrightness={device.brightness}
					initialTemp={device.temp}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'hvac':
			return (
				<HVACCard
					id={device.id}
					name={device.name}
					room={device.room}
					initialTemp={device.temp}
					initialMode={device.mode}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'climate':
			return (
				<ClimateCard
					id={device.id}
					name={device.name}
					temperature={device.temperature}
					mode={device.mode}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'power':
			return (
				<PowerCard
					percentage={device.percentage}
					usage={device.usage}
					cost={device.cost}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'media':
			return (
				<MediaCard
					title={device.title}
					artist={device.artist}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'weather':
			return (
				<WeatherCard
					id={device.id}
					location={device.location}
					temperature={device.temperature}
					condition={device.condition}
					humidity={device.humidity}
					windSpeed={device.windSpeed}
					precipitation={device.precipitation}
					sunrise={device.sunrise}
					sunset={device.sunset}
					daylight={device.daylight}
					rainForecast={device.rainForecast}
					forecast={device.forecast}
					highTemp={device.highTemp}
					lowTemp={device.lowTemp}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'wifi':
			return (
				<WifiCard
					networkName={device.networkName}
					speed={device.speed}
					uploadSpeed={device.uploadSpeed}
					downloadSpeed={device.downloadSpeed}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'switches':
			return (
				<SwitchCard
					name={device.name}
					room={device.room}
					initialState={device.state}
					power={device.power}
					voltage={device.voltage}
					energy={device.energy}
				/>
			);

		case 'covers':
			return (
				<CoverCard
					name={device.name}
					room={device.room}
					initialPosition={device.position}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'locks':
			return <LockCard name={device.name} room={device.room} initialState={device.state} />;

		case 'persons':
			return (
				<PersonCard
					name={device.name}
					location={device.location}
					state={device.state}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'sensors':
			return (
				<SensorCard
					name={device.name}
					room={device.room}
					value={device.value}
					unit={device.unit}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'grouped-sensors':
			return (
				<GroupedSensorCard
					id={device.id}
					name={device.name}
					room={device.room}
					sensors={device.sensors}
					accentColor={device.accentColor}
					size={size}
					onSizeChange={handleSizeChange}
					isEditMode={isEditMode}
				/>
			);

		case 'vacuums':
			return (
				<VacuumCard
					id={device.id}
					name={device.name}
					room={device.room}
					status={device.status}
					battery={device.battery}
					cleanedArea={device.cleanedArea}
					cleaningTime={device.cleaningTime}
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
