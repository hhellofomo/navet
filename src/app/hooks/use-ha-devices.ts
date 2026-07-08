import type { Connection, HassEntity } from 'home-assistant-js-websocket';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { homeAssistantSelectors } from '../stores/selectors';
import type {
  CalendarDevice,
  ClimateDevice,
  CoverDevice,
  DeviceCollection,
  DeviceMetric,
  LightDevice,
  LockDevice,
  MediaDevice,
  PersonDevice,
  SwitchDevice,
  VacuumDevice,
  WeatherDevice,
} from '../types/device.types';
import { UNKNOWN_ROOM_LABEL } from '../utils/device-location';
import { useHomeAssistant } from './use-home-assistant';

type WeatherForecastEntry = Record<string, unknown>;

type WeatherForecastServicePayload = {
  response?: Record<
    string,
    {
      forecast?: WeatherForecastEntry[];
    }
  >;
};

type WeatherForecastServiceEnvelope = WeatherForecastServicePayload & {
  result?: WeatherForecastServicePayload;
};

type CalendarServiceEvent = Record<string, unknown>;

type CalendarEventsServicePayload = {
  response?: Record<
    string,
    {
      events?: CalendarServiceEvent[];
    }
  >;
};

type CalendarEventsServiceEnvelope = CalendarEventsServicePayload & {
  result?: CalendarEventsServicePayload;
};

async function fetchWeatherForecast(
  connection: Connection,
  entityId: string
): Promise<WeatherForecastEntry[]> {
  const response = (await connection.sendMessagePromise({
    type: 'call_service',
    domain: 'weather',
    service: 'get_forecasts',
    target: { entity_id: entityId },
    service_data: { type: 'daily' },
    return_response: true,
  })) as WeatherForecastServiceEnvelope;

  const payload = response?.result?.response ? response.result : response;
  const forecast = payload?.response?.[entityId]?.forecast;
  return Array.isArray(forecast) ? forecast : [];
}

async function fetchCalendarEvents(
  connection: Connection,
  entityId: string
): Promise<CalendarServiceEvent[]> {
  const response = (await connection.sendMessagePromise({
    type: 'call_service',
    domain: 'calendar',
    service: 'get_events',
    target: { entity_id: entityId },
    service_data: {
      duration: { hours: 744 },
    },
    return_response: true,
  })) as CalendarEventsServiceEnvelope;

  const payload = response?.result?.response ? response.result : response;
  const events = payload?.response?.[entityId]?.events;
  return Array.isArray(events) ? events : [];
}

/**
 * Maps Home Assistant entities to Navet device structure
 */
export const useHADevices = (): DeviceCollection => {
  const areas = useHomeAssistant(homeAssistantSelectors.areas);
  const connection = useHomeAssistant(homeAssistantSelectors.connection);
  const deviceRegistry = useHomeAssistant(homeAssistantSelectors.deviceRegistry);
  const entities = useHomeAssistant(homeAssistantSelectors.entities);
  const entityRegistry = useHomeAssistant(homeAssistantSelectors.entityRegistry);
  const { locale, t } = useI18n();
  const primaryWeatherEntityId = useMemo(() => {
    if (!entities) {
      return null;
    }

    return Object.keys(entities).find((entityId) => entityId.startsWith('weather.')) ?? null;
  }, [entities]);
  const calendarEntityIds = useMemo(() => {
    if (!entities) {
      return [];
    }

    return Object.keys(entities)
      .filter((entityId) => entityId.startsWith('calendar.'))
      .sort((left, right) => left.localeCompare(right));
  }, [entities]);
  const [weatherForecasts, setWeatherForecasts] = useState<Record<string, WeatherForecastEntry[]>>(
    {}
  );
  const [calendarEvents, setCalendarEvents] = useState<Record<string, CalendarServiceEvent[]>>({});

  useEffect(() => {
    if (!connection || !primaryWeatherEntityId) {
      setWeatherForecasts({});
      return;
    }

    let cancelled = false;

    void fetchWeatherForecast(connection, primaryWeatherEntityId)
      .then((forecast) => {
        if (cancelled) {
          return;
        }

        setWeatherForecasts({ [primaryWeatherEntityId]: forecast });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setWeatherForecasts({});
      });

    return () => {
      cancelled = true;
    };
  }, [connection, primaryWeatherEntityId]);

  useEffect(() => {
    if (!connection || calendarEntityIds.length === 0) {
      setCalendarEvents({});
      return;
    }

    let cancelled = false;

    void Promise.all(
      calendarEntityIds.map(async (entityId) => {
        const events = await fetchCalendarEvents(connection, entityId).catch(() => []);
        return [entityId, events] as const;
      })
    ).then((entries) => {
      if (cancelled) {
        return;
      }

      setCalendarEvents(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
  }, [calendarEntityIds, connection]);

  return useMemo(() => {
    const brightnessToPercent = (entityId: string, entity: HassEntity): number => {
      const brightnessPct = entity.attributes?.brightness_pct;
      if (typeof brightnessPct === 'number' && !Number.isNaN(brightnessPct)) {
        return Math.max(0, Math.min(100, Math.round(brightnessPct)));
      }

      const brightness = entity.attributes?.brightness;
      if (typeof brightness === 'number' && !Number.isNaN(brightness)) {
        return Math.max(0, Math.min(100, Math.round((brightness / 255) * 100)));
      }

      if (typeof brightnessPct === 'string') {
        const parsedBrightnessPct = Number.parseFloat(brightnessPct);
        if (!Number.isNaN(parsedBrightnessPct)) {
          return Math.max(0, Math.min(100, Math.round(parsedBrightnessPct)));
        }
      }

      if (typeof brightness === 'string') {
        const parsedBrightness = Number.parseFloat(brightness);
        if (!Number.isNaN(parsedBrightness)) {
          return Math.max(0, Math.min(100, Math.round((parsedBrightness / 255) * 100)));
        }
      }

      if (import.meta.env.DEV && entity.state === 'on') {
        console.debug('[Navet] Light missing brightness attributes', {
          entityId,
          attributes: entity.attributes,
        });
      }

      // Some integrations expose on/off without a brightness attribute.
      return entity.state === 'on' ? 100 : 0;
    };

    const normalizeKelvin = (entity: HassEntity): number => {
      const kelvin = entity.attributes?.color_temp_kelvin;
      if (typeof kelvin === 'number' && !Number.isNaN(kelvin)) {
        return Math.round(kelvin);
      }

      const mired = entity.attributes?.color_temp;
      if (typeof mired === 'number' && mired > 0) {
        return Math.round(1000000 / mired);
      }

      return 4000;
    };

    const parseNumberish = (value: unknown): number | null => {
      if (typeof value === 'number' && !Number.isNaN(value)) {
        return value;
      }

      if (typeof value === 'string') {
        const parsed = Number.parseFloat(value);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }

      return null;
    };

    const parseRoundedNumberish = (value: unknown): number | null => {
      const parsed = parseNumberish(value);
      return parsed === null ? null : Math.round(parsed);
    };

    const toWatts = (value: number, unit: unknown): number => {
      if (typeof unit !== 'string') {
        return value;
      }

      switch (unit.toLowerCase()) {
        case 'kw':
          return value * 1000;
        case 'mw':
          return value * 1000000;
        default:
          return value;
      }
    };

    const toVolts = (value: number, unit: unknown): number => {
      if (typeof unit !== 'string') {
        return value;
      }

      switch (unit.toLowerCase()) {
        case 'mv':
          return value / 1000;
        case 'kv':
          return value * 1000;
        default:
          return value;
      }
    };

    const toKilowattHours = (value: number, unit: unknown): number => {
      if (typeof unit !== 'string') {
        return value;
      }

      switch (unit.toLowerCase()) {
        case 'wh':
          return value / 1000;
        case 'mwh':
          return value * 1000;
        default:
          return value;
      }
    };

    if (!entities) {
      return {
        lights: [],
        hvac: [],
        climate: [],
        power: [],
        media: [],
        weather: [],
        wifi: [],
        switches: [],
        covers: [],
        locks: [],
        persons: [],
        sensors: [],
        vacuums: [],
        calendars: [],
        'grouped-sensors': [],
      };
    }

    const sunEntity = entities['sun.sun'];
    const sunEntitySunrise = sunEntity?.attributes?.next_rising;
    const sunEntitySunset = sunEntity?.attributes?.next_setting;

    // Process entities into device collections
    const lights: LightDevice[] = [];
    const switches: SwitchDevice[] = [];
    const climate: ClimateDevice[] = [];
    const media: MediaDevice[] = [];
    const persons: PersonDevice[] = [];
    const covers: CoverDevice[] = [];
    const locks: LockDevice[] = [];
    const vacuums: VacuumDevice[] = [];
    const weather: WeatherDevice[] = [];
    const calendars: CalendarDevice[] = [];
    const areaMap = new Map(areas.map((area) => [area.area_id, area.name]));
    const entityRegistryMap = new Map(
      entityRegistry.map((registryEntry) => [registryEntry.entity_id, registryEntry])
    );
    const deviceRegistryMap = new Map(deviceRegistry.map((device) => [device.id, device]));
    const switchMetricsByDeviceId = new Map<string, DeviceMetric[]>();

    // Resolve room from Home Assistant registries first, then fall back to entity attributes.
    const getRoom = (entityId: string, entity: HassEntity): string => {
      const entityEntry = entityRegistryMap.get(entityId);
      const deviceEntry = entityEntry?.device_id
        ? deviceRegistryMap.get(entityEntry.device_id)
        : undefined;
      const areaId = entityEntry?.area_id ?? deviceEntry?.area_id;

      if (areaId) {
        const areaName = areaMap.get(areaId);
        if (areaName) {
          return areaName;
        }
      }

      return (
        entity.attributes?.room ||
        entity.attributes?.area ||
        entity.attributes?.zone ||
        UNKNOWN_ROOM_LABEL
      );
    };

    // Helper function to get friendly name or entity id
    const getName = (entity: HassEntity): string => {
      return entity.attributes?.friendly_name || entity.entity_id;
    };

    const formatClock = (value: unknown): string => {
      if (typeof value !== 'string' || !value) {
        return '--';
      }

      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return value;
      }

      return new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    };

    const formatDaylight = (sunrise: unknown, sunset: unknown): string => {
      if (typeof sunrise !== 'string' || typeof sunset !== 'string') {
        return '--';
      }

      const sunriseDate = new Date(sunrise);
      const sunsetDate = new Date(sunset);
      if (Number.isNaN(sunriseDate.getTime()) || Number.isNaN(sunsetDate.getTime())) {
        return '--';
      }

      const diffMs = Math.max(0, sunsetDate.getTime() - sunriseDate.getTime());
      const hours = Math.floor(diffMs / 3_600_000);
      const minutes = Math.round((diffMs % 3_600_000) / 60_000);
      return `${hours} h ${minutes} m`;
    };

    const parseCalendarDate = (value: unknown): Date | null => {
      if (typeof value === 'string' && value) {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
      }

      if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        const raw = record.dateTime ?? record.date;
        if (typeof raw === 'string' && raw) {
          const parsed = new Date(raw);
          return Number.isNaN(parsed.getTime()) ? null : parsed;
        }
      }

      return null;
    };

    const isAllDayCalendarValue = (value: unknown): boolean => {
      if (typeof value === 'string' && value) {
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
      }

      if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        return typeof record.date === 'string' && record.date.length > 0;
      }

      return false;
    };

    const formatCalendarTime = (date: Date | null): string => {
      if (!date) {
        return '--';
      }

      return new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    };

    const inferCalendarEventType = (title: string, location?: string) => {
      const searchText = `${title} ${location ?? ''}`.toLowerCase();

      if (
        searchText.includes('zoom') ||
        searchText.includes('meet') ||
        searchText.includes('teams') ||
        searchText.includes('call') ||
        searchText.includes('video')
      ) {
        return 'call' as const;
      }

      if (
        searchText.includes('meeting') ||
        searchText.includes('standup') ||
        searchText.includes('review') ||
        searchText.includes('sync')
      ) {
        return 'meeting' as const;
      }

      return 'event' as const;
    };

    const inferMetricIcon = (
      deviceClass: string | null,
      searchText: string,
      unit: unknown
    ): DeviceMetric['icon'] => {
      const normalizedUnit = typeof unit === 'string' ? unit.toLowerCase() : '';
      const normalizedSearch = searchText.toLowerCase();

      if (
        deviceClass === 'motion' ||
        deviceClass === 'occupancy' ||
        normalizedSearch.includes('motion') ||
        normalizedSearch.includes('occupancy') ||
        normalizedSearch.includes('presence') ||
        normalizedSearch.includes('pir')
      ) {
        return 'motion';
      }

      if (
        deviceClass === 'power' ||
        normalizedSearch.includes('power') ||
        normalizedSearch.includes('watt') ||
        normalizedSearch.includes('consumption') ||
        normalizedUnit === 'w' ||
        normalizedUnit === 'kw' ||
        normalizedUnit === 'mw'
      ) {
        return 'zap';
      }

      if (
        deviceClass === 'voltage' ||
        normalizedSearch.includes('voltage') ||
        normalizedUnit === 'v' ||
        normalizedUnit === 'mv' ||
        normalizedUnit === 'kv'
      ) {
        return 'gauge';
      }

      if (
        deviceClass === 'temperature' ||
        normalizedSearch.includes('temperature') ||
        normalizedSearch.includes('temp') ||
        normalizedUnit.includes('c') ||
        normalizedUnit.includes('f')
      ) {
        return 'thermometer';
      }

      if (
        deviceClass === 'humidity' ||
        normalizedSearch.includes('humidity') ||
        normalizedUnit === '%'
      ) {
        return 'droplets';
      }

      if (
        deviceClass === 'current' ||
        deviceClass === 'energy' ||
        normalizedSearch.includes('current') ||
        normalizedSearch.includes('amp') ||
        normalizedSearch.includes('energy') ||
        normalizedUnit === 'a' ||
        normalizedUnit === 'ma' ||
        normalizedUnit === 'wh' ||
        normalizedUnit === 'kwh' ||
        normalizedUnit === 'mwh'
      ) {
        return 'activity';
      }

      return 'activity';
    };

    const getMetricLabel = (entityId: string, entity: HassEntity): string => {
      const friendlyName =
        typeof entity.attributes?.friendly_name === 'string'
          ? entity.attributes.friendly_name.trim()
          : '';
      if (friendlyName) {
        return friendlyName;
      }

      return (
        entityId
          .split('.')
          .slice(-1)[0]
          ?.replace(/_/g, ' ')
          .replace(/\b\w/g, (char: string) => char.toUpperCase()) ?? entityId
      );
    };

    const formatEntityType = (deviceClass: unknown, fallback: string): string => {
      if (typeof deviceClass === 'string' && deviceClass.trim()) {
        const normalized = deviceClass.trim().toLowerCase();

        if (normalized === 'outlet') {
          return t('lighting.type.outlet');
        }

        if (normalized === 'switch') {
          return t('lighting.type.switch');
        }

        return deviceClass
          .trim()
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
      }

      return fallback;
    };

    const formatMediaEntityType = (deviceClass: unknown): string => {
      if (typeof deviceClass !== 'string' || !deviceClass.trim()) {
        return t('media.type.player');
      }

      const normalized = deviceClass.trim().toLowerCase();

      switch (normalized) {
        case 'tv':
        case 'television':
          return t('media.type.tv');
        case 'speaker':
          return t('media.type.speaker');
        case 'receiver':
          return t('media.type.receiver');
        case 'set_top_box':
          return t('media.type.setTopBox');
        case 'streaming_box':
          return t('media.type.streamingBox');
        case 'soundbar':
          return t('media.type.soundbar');
        default:
          return deviceClass
            .trim()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
      }
    };

    const normalizeMetric = (
      deviceClass: string | null,
      friendlyName: string,
      rawValue: number,
      unit: unknown
    ): { label: string; unit: string; value: number } | null => {
      if (
        deviceClass === 'power' ||
        friendlyName.includes('power') ||
        unit === 'W' ||
        unit === 'kW' ||
        unit === 'MW'
      ) {
        return { label: 'Power', value: toWatts(rawValue, unit), unit: 'W' };
      }

      if (
        deviceClass === 'voltage' ||
        friendlyName.includes('voltage') ||
        unit === 'V' ||
        unit === 'mV' ||
        unit === 'kV'
      ) {
        return { label: 'Voltage', value: toVolts(rawValue, unit), unit: 'V' };
      }

      if (
        deviceClass === 'energy' ||
        friendlyName.includes('energy') ||
        unit === 'Wh' ||
        unit === 'kWh' ||
        unit === 'MWh'
      ) {
        return { label: 'Energy', value: toKilowattHours(rawValue, unit), unit: 'kWh' };
      }

      return null;
    };

    Object.entries(entities).forEach(([entityId, entity]) => {
      const domain = entityId.split('.')[0];
      if (domain === 'sensor') {
        const entityEntry = entityRegistryMap.get(entityId);
        const deviceId = entityEntry?.device_id;
        if (!deviceId) {
          return;
        }

        const rawValue =
          parseNumberish(entity.state) ??
          parseNumberish(entity.attributes?.native_value) ??
          parseNumberish(entity.attributes?.value);
        if (rawValue === null) {
          return;
        }

        const metricState = switchMetricsByDeviceId.get(deviceId) ?? [];
        const deviceClass =
          typeof entity.attributes?.device_class === 'string'
            ? entity.attributes.device_class.toLowerCase()
            : null;
        const unit =
          entity.attributes?.unit_of_measurement ?? entity.attributes?.native_unit_of_measurement;
        const friendlyName =
          typeof entity.attributes?.friendly_name === 'string'
            ? entity.attributes.friendly_name.toLowerCase()
            : '';
        const normalizedMetric = normalizeMetric(deviceClass, friendlyName, rawValue, unit);
        if (normalizedMetric) {
          const nextMetric: DeviceMetric = {
            ...normalizedMetric,
            icon: inferMetricIcon(
              deviceClass,
              `${entityId} ${friendlyName} ${entity.attributes?.friendly_name ?? ''}`,
              unit
            ),
            category: 'measurement',
          };
          const existingIndex = metricState.findIndex(
            (metric) => metric.label === nextMetric.label
          );
          if (existingIndex === -1) {
            metricState.push(nextMetric);
          } else {
            metricState[existingIndex] = nextMetric;
          }
        }

        switchMetricsByDeviceId.set(deviceId, metricState);
        return;
      }

      if (domain === 'number' || domain === 'input_number' || domain === 'select') {
        const entityEntry = entityRegistryMap.get(entityId);
        const deviceId = entityEntry?.device_id;
        const entityCategory = (entityEntry as { entity_category?: string | null } | undefined)
          ?.entity_category;
        if (!deviceId || entityCategory !== 'config') {
          return;
        }

        const metricState = switchMetricsByDeviceId.get(deviceId) ?? [];
        const label = getMetricLabel(entityId, entity);
        const unit =
          typeof entity.attributes?.unit_of_measurement === 'string'
            ? entity.attributes.unit_of_measurement
            : typeof entity.attributes?.native_unit_of_measurement === 'string'
              ? entity.attributes.native_unit_of_measurement
              : '';
        const parsedValue =
          domain === 'select'
            ? entity.state
            : (parseNumberish(entity.state) ??
              parseNumberish(entity.attributes?.native_value) ??
              parseNumberish(entity.attributes?.value));
        if (parsedValue == null || parsedValue === '') {
          return;
        }

        const nextMetric: DeviceMetric = {
          label,
          value: parsedValue,
          unit,
          icon: inferMetricIcon(null, `${entityId} ${label}`, unit),
          category: 'configuration',
        };
        const existingIndex = metricState.findIndex((metric) => metric.label === nextMetric.label);
        if (existingIndex === -1) {
          metricState.push(nextMetric);
        } else {
          metricState[existingIndex] = nextMetric;
        }

        switchMetricsByDeviceId.set(deviceId, metricState);
      }
    });

    // Process each entity based on domain
    Object.entries(entities).forEach(([entityId, entity]) => {
      const domain = entityId.split('.')[0];
      const name = getName(entity);
      const room = getRoom(entityId, entity);

      switch (domain) {
        case 'light':
          lights.push({
            id: entityId,
            name,
            room,
            size: 'small',
            state: entity.state === 'on',
            brightness: brightnessToPercent(entityId, entity),
            temp: normalizeKelvin(entity),
          });
          break;

        case 'switch': {
          const entityEntry = entityRegistryMap.get(entityId);
          const deviceMetrics = entityEntry?.device_id
            ? switchMetricsByDeviceId.get(entityEntry.device_id)
            : undefined;
          const powerMetric = deviceMetrics?.find((metric) => metric.label === 'Power');
          const voltageMetric = deviceMetrics?.find((metric) => metric.label === 'Voltage');
          const energyMetric = deviceMetrics?.find((metric) => metric.label === 'Energy');
          switches.push({
            id: entityId,
            name,
            room,
            size: 'small',
            state: entity.state === 'on',
            entityType: formatEntityType(
              entity.attributes?.device_class,
              t('lighting.type.switch')
            ),
            power:
              parseNumberish(entity.attributes?.power) ??
              parseNumberish(entity.attributes?.current_power_w) ??
              (typeof powerMetric?.value === 'number' ? powerMetric.value : undefined),
            voltage:
              parseNumberish(entity.attributes?.voltage) ??
              parseNumberish(entity.attributes?.current_voltage) ??
              (typeof voltageMetric?.value === 'number' ? voltageMetric.value : undefined),
            energy:
              parseNumberish(entity.attributes?.energy) ??
              parseNumberish(entity.attributes?.energy_today) ??
              (typeof energyMetric?.value === 'number' ? energyMetric.value : undefined),
            metrics: deviceMetrics,
          });
          break;
        }

        case 'climate':
          climate.push({
            id: entityId,
            name,
            room,
            size: 'medium',
            temperature: parseFloat(entity.attributes?.temperature) || 0,
            currentTemperature:
              parseNumberish(entity.attributes?.current_temperature) ??
              (parseFloat(entity.attributes?.temperature ?? '0') || 0),
            mode:
              (typeof entity.state === 'string' && entity.state) ||
              (typeof entity.attributes?.hvac_mode === 'string' && entity.attributes.hvac_mode) ||
              'off',
            action:
              (typeof entity.attributes?.hvac_action === 'string' &&
                entity.attributes.hvac_action) ||
              undefined,
          });
          break;

        case 'media_player': {
          const mediaEntityType = formatMediaEntityType(entity.attributes?.device_class);
          const entityPicture =
            (typeof entity.attributes?.entity_picture === 'string' &&
              entity.attributes.entity_picture) ||
            (typeof entity.attributes?.entity_picture_local === 'string' &&
              entity.attributes.entity_picture_local) ||
            (typeof entity.attributes?.media_image_url === 'string' &&
              entity.attributes.media_image_url) ||
            undefined;
          const mediaTitle =
            (typeof entity.attributes?.media_title === 'string' && entity.attributes.media_title) ||
            (typeof entity.attributes?.app_name === 'string' && entity.attributes.app_name) ||
            name;
          const mediaArtist =
            (typeof entity.attributes?.media_artist === 'string' &&
              entity.attributes.media_artist) ||
            (typeof entity.attributes?.source === 'string' && entity.attributes.source) ||
            (typeof entity.attributes?.media_album_name === 'string' &&
              entity.attributes.media_album_name) ||
            mediaEntityType;
          const volumeLevel = parseNumberish(entity.attributes?.volume_level);
          const mediaPosition = parseNumberish(entity.attributes?.media_position);
          const mediaDuration = parseNumberish(entity.attributes?.media_duration);
          const positionUpdatedAt =
            typeof entity.attributes?.media_position_updated_at === 'string'
              ? entity.attributes.media_position_updated_at
              : undefined;
          const normalizedState: MediaDevice['state'] =
            entity.state === 'playing'
              ? 'playing'
              : entity.state === 'paused'
                ? 'paused'
                : entity.state === 'off' || entity.state === 'standby'
                  ? 'off'
                  : 'idle';

          media.push({
            id: entityId,
            name,
            room,
            size: 'medium',
            title: mediaTitle,
            artist: mediaArtist,
            entityPicture,
            state: normalizedState,
            volume:
              typeof volumeLevel === 'number'
                ? Math.max(0, Math.min(100, Math.round(volumeLevel * 100)))
                : 70,
            isMuted: entity.attributes?.is_volume_muted === true,
            elapsedSeconds:
              typeof mediaPosition === 'number'
                ? Math.max(0, Math.floor(mediaPosition))
                : undefined,
            durationSeconds:
              typeof mediaDuration === 'number'
                ? Math.max(0, Math.floor(mediaDuration))
                : undefined,
            positionUpdatedAt,
          });
          break;
        }

        case 'person':
          persons.push({
            id: entityId,
            name,
            size: 'small',
            location: entity.state,
            state: entity.state === 'home' ? 'home' : 'away',
          });
          break;

        case 'cover':
          covers.push({
            id: entityId,
            name,
            room,
            size: 'medium',
            position: entity.attributes?.current_position || 0,
          });
          break;

        case 'lock':
          locks.push({
            id: entityId,
            name,
            room,
            size: 'small',
            state: entity.state === 'locked',
          });
          break;

        case 'vacuum': {
          const batteryLevel = parseNumberish(entity.attributes?.battery_level);
          const cleanedAreaValue =
            parseNumberish(entity.attributes?.cleaned_area) ??
            parseNumberish(entity.attributes?.cleaned_area_today) ??
            parseNumberish(entity.attributes?.last_cleaned_area);
          const cleaningTimeMinutes =
            parseNumberish(entity.attributes?.cleaning_time) ??
            parseNumberish(entity.attributes?.clean_time) ??
            parseNumberish(entity.attributes?.cleaning_duration);

          const normalizedStatus: VacuumDevice['status'] =
            entity.state === 'cleaning'
              ? 'cleaning'
              : entity.state === 'returning' || entity.state === 'returning_home'
                ? 'returning'
                : entity.state === 'paused'
                  ? 'paused'
                  : entity.state === 'docked'
                    ? 'docked'
                    : 'idle';

          vacuums.push({
            id: entityId,
            name,
            room,
            size: 'medium',
            status: normalizedStatus,
            battery:
              typeof batteryLevel === 'number' ? Math.max(0, Math.min(100, batteryLevel)) : 0,
            cleanedArea:
              typeof cleanedAreaValue === 'number'
                ? `${cleanedAreaValue.toFixed(cleanedAreaValue >= 10 ? 0 : 1)} m²`
                : undefined,
            cleaningTime:
              typeof cleaningTimeMinutes === 'number'
                ? `${Math.max(0, Math.round(cleaningTimeMinutes))} min`
                : undefined,
          });
          break;
        }

        case 'calendar': {
          const rawEvents = calendarEvents[entityId] ?? [];
          const fallbackTitle =
            typeof entity.attributes?.message === 'string' ? entity.attributes.message : '';
          const fallbackLocation =
            typeof entity.attributes?.location === 'string'
              ? entity.attributes.location
              : undefined;
          const fallbackEvents =
            fallbackTitle.length > 0
              ? [
                  {
                    id: `${entityId}-current`,
                    title: fallbackTitle,
                    start: entity.attributes?.start_time,
                    end: entity.attributes?.end_time,
                    location: fallbackLocation,
                  },
                ]
              : [];

          const colors = [
            'bg-blue-500',
            'bg-purple-500',
            'bg-green-500',
            'bg-orange-500',
            'bg-indigo-500',
          ] as const;

          const events = (rawEvents.length > 0 ? rawEvents : fallbackEvents)
            .map((rawEvent, index) => {
              const eventRecord = rawEvent as Record<string, unknown>;
              const title =
                typeof eventRecord.title === 'string'
                  ? eventRecord.title
                  : typeof eventRecord.summary === 'string'
                    ? eventRecord.summary
                    : typeof eventRecord.message === 'string'
                      ? eventRecord.message
                      : t('calendar.fallbackEvent', { count: index + 1 });
              const location =
                typeof eventRecord.location === 'string' ? eventRecord.location : undefined;
              const description =
                typeof eventRecord.description === 'string'
                  ? eventRecord.description
                  : typeof eventRecord.notes === 'string'
                    ? eventRecord.notes
                    : typeof eventRecord.message === 'string'
                      ? eventRecord.message
                      : undefined;
              const startDate = parseCalendarDate(eventRecord.start ?? eventRecord.start_time);
              const endDate = parseCalendarDate(eventRecord.end ?? eventRecord.end_time);
              const isAllDay = isAllDayCalendarValue(eventRecord.start ?? eventRecord.start_time);
              const attendees = Array.isArray(eventRecord.attendees)
                ? eventRecord.attendees.length
                : typeof eventRecord.attendees === 'number'
                  ? eventRecord.attendees
                  : undefined;

              return {
                id:
                  (typeof eventRecord.uid === 'string' && eventRecord.uid) ||
                  (typeof eventRecord.id === 'string' && eventRecord.id) ||
                  `${entityId}-${index}`,
                title,
                startTime: formatCalendarTime(startDate),
                endTime: formatCalendarTime(endDate),
                timeDisplay: formatCalendarTime(startDate),
                isAllDay,
                location,
                description,
                type: inferCalendarEventType(title, location),
                color: colors[index % colors.length],
                attendees,
                sortKey: startDate?.toISOString(),
                sourceId: entityId,
                sourceName: name,
                startDate,
              };
            })
            .sort((left, right) => {
              const leftTime = left.startDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
              const rightTime = right.startDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
              return leftTime - rightTime;
            })
            .slice(0, 5)
            .map(({ startDate: _startDate, ...event }) => event);

          calendars.push({
            id: entityId,
            name,
            room,
            size: 'medium',
            events,
          });
          break;
        }

        case 'weather': {
          if (entityId !== primaryWeatherEntityId) {
            break;
          }

          const forecastSource = Array.isArray(weatherForecasts[entityId])
            ? weatherForecasts[entityId]
            : Array.isArray(entity.attributes?.forecast)
              ? (entity.attributes.forecast as WeatherForecastEntry[])
              : [];

          const forecast = forecastSource
            .slice(0, 7)
            .map((entry: Record<string, unknown>, index) => {
              const forecastDate =
                typeof entry.datetime === 'string'
                  ? new Date(entry.datetime)
                  : typeof entry.datetime === 'number'
                    ? new Date(entry.datetime)
                    : null;
              const dayLabel =
                forecastDate && !Number.isNaN(forecastDate.getTime())
                  ? index === 0
                    ? t('weather.today')
                    : new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(forecastDate)
                  : index === 0
                    ? t('weather.today')
                    : t('weather.dayFallback', { day: index + 1 });

              return {
                day: dayLabel,
                condition: (typeof entry.condition === 'string' && entry.condition) || entity.state,
                high: parseRoundedNumberish(entry.temperature) ?? 0,
                low: parseRoundedNumberish(entry.templow) ?? 0,
              };
            });

          const highTemp =
            forecast[0]?.high ??
            parseRoundedNumberish(entity.attributes?.temperature) ??
            parseRoundedNumberish(entity.attributes?.native_temperature) ??
            0;
          const lowTemp = forecast[0]?.low ?? highTemp;

          const sunriseSource = sunEntitySunrise ?? entity.attributes?.sunrise;
          const sunsetSource = sunEntitySunset ?? entity.attributes?.sunset;

          weather.push({
            id: entityId,
            name,
            room,
            size: 'large',
            location: name,
            temperature:
              parseRoundedNumberish(entity.attributes?.temperature) ??
              parseRoundedNumberish(entity.attributes?.native_temperature) ??
              0,
            condition: entity.state,
            humidity: parseNumberish(entity.attributes?.humidity) ?? 0,
            windSpeed:
              parseNumberish(entity.attributes?.wind_speed) ??
              parseNumberish(entity.attributes?.native_wind_speed) ??
              0,
            pressure:
              parseNumberish(entity.attributes?.pressure) ??
              parseNumberish(entity.attributes?.native_pressure) ??
              0,
            precipitation:
              parseNumberish(entity.attributes?.precipitation_probability) ??
              parseNumberish(entity.attributes?.precipitation) ??
              0,
            sunrise: formatClock(sunriseSource),
            sunset: formatClock(sunsetSource),
            daylight: formatDaylight(sunriseSource, sunsetSource),
            rainForecast:
              forecastSource[1] &&
              parseNumberish(
                (forecastSource[1] as Record<string, unknown>).precipitation_probability
              ) !== null
                ? t('weather.rainTomorrow', {
                    chance: Math.round(
                      parseNumberish(
                        (forecastSource[1] as Record<string, unknown>).precipitation_probability
                      ) ?? 0
                    ),
                  })
                : '',
            highTemp,
            lowTemp,
            forecast,
          });
          break;
        }
      }
    });

    return {
      lights,
      hvac: [],
      climate,
      media,
      power: [],
      weather,
      wifi: [],
      switches,
      covers,
      locks,
      persons,
      sensors: [],
      vacuums,
      calendars,
      'grouped-sensors': [],
    };
  }, [
    areas,
    calendarEvents,
    deviceRegistry,
    entities,
    entityRegistry,
    locale,
    primaryWeatherEntityId,
    t,
    weatherForecasts,
  ]);
};
