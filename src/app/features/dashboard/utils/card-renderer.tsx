import type { ReactElement } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { CalendarCard } from '@/app/features/calendar';
import { HVACCard } from '@/app/features/climate';
import { LightCard, SwitchCard } from '@/app/features/lighting';
import { MediaCard } from '@/app/features/media';
import { PersonCard } from '@/app/features/person';
import { PowerCard } from '@/app/features/power';
import { RSSFeedCard } from '@/app/features/rss';
import { CoverCard, LockCard } from '@/app/features/security';
import { GroupedSensorCard, SensorCard, type SensorReading } from '@/app/features/sensors';
import { VacuumCard } from '@/app/features/vacuum';
import { WeatherCard } from '@/app/features/weather';
import { WifiCard } from '@/app/features/wifi';
import type { DeviceMetric } from '@/app/types/device.types';

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
          id={device.id as string}
          name={device.name as string}
          room={device.room as string}
          initialState={device.state as boolean | undefined}
          initialBrightness={device.brightness as number | undefined}
          initialTemp={device.temp as number | undefined}
          size={size}
          onSizeChange={handleSizeChange}
          isEditMode={isEditMode}
        />
      );
    case 'hvac':
      return (
        <HVACCard
          id={device.id as string}
          name={device.name as string}
          room={device.room as string}
          initialTemp={device.temp as number | undefined}
          initialMode={device.mode as string | undefined}
          size={size}
          onSizeChange={handleSizeChange}
          isEditMode={isEditMode}
        />
      );
    case 'climate':
      return (
        <HVACCard
          id={device.id as string}
          name={device.name as string}
          room={device.room as string}
          initialTemp={device.temperature as number | undefined}
          initialCurrentTemp={device.temperature as number | undefined}
          initialMode={device.mode as string | undefined}
          initialState={(device.mode as string | undefined) !== 'off'}
          size={size}
          onSizeChange={handleSizeChange}
          isEditMode={isEditMode}
        />
      );
    case 'power':
      return (
        <PowerCard
          percentage={device.percentage as number}
          usage={String(device.usage ?? '')}
          cost={String(device.cost ?? '')}
          size={size}
          onSizeChange={handleSizeChange}
          isEditMode={isEditMode}
        />
      );
    case 'media':
      return (
        <MediaCard
          id={device.id as string}
          name={device.name as string}
          room={device.room as string}
          title={device.title as string}
          artist={device.artist as string}
          entityPicture={device.entityPicture as string | undefined}
          state={device.state as 'playing' | 'paused' | 'idle' | 'off'}
          volume={device.volume as number}
          isMuted={device.isMuted as boolean}
          elapsedSeconds={device.elapsedSeconds as number | undefined}
          durationSeconds={device.durationSeconds as number | undefined}
          positionUpdatedAt={device.positionUpdatedAt as string | undefined}
          size={size}
          onSizeChange={handleSizeChange}
          isEditMode={isEditMode}
        />
      );
    case 'weather':
      return (
        <WeatherCard
          id={device.id as string}
          location={device.location as string}
          temperature={device.temperature as number}
          condition={device.condition as string}
          humidity={device.humidity as number}
          windSpeed={device.windSpeed as number}
          precipitation={device.precipitation as number}
          sunrise={device.sunrise as string}
          sunset={device.sunset as string}
          daylight={device.daylight as string}
          rainForecast={device.rainForecast as string}
          forecast={
            (device.forecast as Array<{
              day: string;
              condition: string;
              high: number;
              low: number;
            }>) ?? []
          }
          highTemp={device.highTemp as number}
          lowTemp={device.lowTemp as number}
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
          id={device.id as string}
          name={device.name as string}
          size={size}
          initialState={device.state as boolean | undefined}
          entityType={device.entityType as string | undefined}
          power={device.power as number | undefined}
          voltage={device.voltage as number | undefined}
          energy={device.energy as number | undefined}
          metrics={device.metrics as DeviceMetric[] | undefined}
          isEditMode={isEditMode}
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
        <LockCard name={device.name as string} initialState={device.state as boolean | undefined} />
      );
    case 'persons':
      return (
        <PersonCard
          name={device.name as string}
          location={device.location as string}
          state={device.state as 'home' | 'away'}
          size={size}
          onSizeChange={handleSizeChange}
          isEditMode={isEditMode}
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
