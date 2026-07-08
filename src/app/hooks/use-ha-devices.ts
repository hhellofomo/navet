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
	SensorDevice,
	SwitchDevice,
} from '../types/device.types';

/**
 * Maps Home Assistant entities to Navet device structure
 */
export const useHADevices = (): DeviceCollection => {
	const { entities } = useHomeAssistantContext();

	return useMemo(() => {
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
		const sensors: SensorDevice[] = [];
		const climate: ClimateDevice[] = [];
		const persons: PersonDevice[] = [];
		const covers: CoverDevice[] = [];
		const locks: LockDevice[] = [];

		// Helper function to extract room from entity
		const getRoom = (entity: HassEntity): string => {
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
			const room = getRoom(entity);

			switch (domain) {
				case 'light':
					lights.push({
						id: entityId,
						name,
						room,
						size: 'medium',
						state: entity.state === 'on',
						brightness: entity.attributes?.brightness || 0,
						temp: entity.attributes?.color_temp || 0,
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

				case 'sensor':
					sensors.push({
						id: entityId,
						name,
						room,
						size: 'small',
						value: entity.state,
						unit: entity.attributes?.unit_of_measurement || '',
					});
					break;

				case 'climate':
					climate.push({
						id: entityId,
						name,
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
			sensors,
			vacuums: [],
			rssFeeds: [],
			calendars: [],
		};
	}, [entities]);
};
