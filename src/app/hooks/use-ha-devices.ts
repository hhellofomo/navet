import type { HassEntity } from 'home-assistant-js-websocket';
import { useMemo } from 'react';
import { useHomeAssistantContext } from '../contexts/home-assistant-context';
import type {
	ClimateDevice,
	CoverDevice,
	DeviceCollection,
	LightDevice,
	LockDevice,
	PersonDevice,
	SwitchDevice,
} from '../types/device.types';

/**
 * Maps Home Assistant entities to Navet device structure
 */
export const useHADevices = (): DeviceCollection => {
	const { areas, deviceRegistry, entities, entityRegistry } = useHomeAssistantContext();

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
				rssFeeds: [],
				calendars: [],
			};
		}

		// Process entities into device collections
		const lights: LightDevice[] = [];
		const switches: SwitchDevice[] = [];
		const climate: ClimateDevice[] = [];
		const persons: PersonDevice[] = [];
		const covers: CoverDevice[] = [];
		const locks: LockDevice[] = [];
		const areaMap = new Map(areas.map((area) => [area.area_id, area.name]));
		const entityRegistryMap = new Map(
			entityRegistry.map((registryEntry) => [registryEntry.entity_id, registryEntry])
		);
		const deviceRegistryMap = new Map(deviceRegistry.map((device) => [device.id, device]));

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
				entity.attributes?.room || entity.attributes?.area || entity.attributes?.zone || 'Unknown'
			);
		};

		// Helper function to get friendly name or entity id
		const getName = (entity: HassEntity): string => {
			return entity.attributes?.friendly_name || entity.entity_id;
		};

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
						size: 'medium',
						state: entity.state === 'on',
						brightness: brightnessToPercent(entityId, entity),
						temp: normalizeKelvin(entity),
					});
					break;

				case 'switch':
					switches.push({
						id: entityId,
						name,
						room,
						size: 'small',
						state: entity.state === 'on',
						power: entity.attributes?.power || 0,
						voltage: entity.attributes?.voltage || 0,
						energy: entity.attributes?.energy || 0,
					});
					break;

				case 'climate':
					climate.push({
						id: entityId,
						name,
						room,
						size: 'medium',
						temperature: parseFloat(entity.attributes?.temperature) || 0,
						mode: entity.attributes?.hvac_mode || 'off',
					});
					break;

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
			}
		});

		return {
			lights,
			hvac: [],
			climate,
			power: [],
			media: [],
			weather: [],
			wifi: [],
			switches,
			covers,
			locks,
			persons,
			sensors: [],
			vacuums: [],
			rssFeeds: [],
			calendars: [],
		};
	}, [areas, deviceRegistry, entities, entityRegistry]);
};
