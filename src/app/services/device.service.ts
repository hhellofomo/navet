import type { DeviceCollection, DeviceWithType } from '../types/device.types';

/**
 * Device Service
 * Handles all device data operations
 * In production, this would make API calls
 */
class DeviceService {
	/**
	 * Create a device map for quick lookups by ID
	 */
	createDeviceMap(devices: DeviceCollection): Map<string, DeviceWithType> {
		const deviceMap = new Map<string, DeviceWithType>();

		Object.entries(devices).forEach(([type, deviceArray]) => {
			deviceArray.forEach((device: any) => {
				deviceMap.set(device.id, { ...device, type: type as keyof DeviceCollection });
			});
		});

		return deviceMap;
	}

	/**
	 * Get devices for a specific room
	 */
	getDevicesByRoom(devices: DeviceCollection, room: string): DeviceWithType[] {
		const allDevices: DeviceWithType[] = [];

		Object.entries(devices).forEach(([type, deviceArray]) => {
			deviceArray.forEach((device: any) => {
				const deviceWithType = { ...device, type: type as keyof DeviceCollection };

				if ('room' in device && device.room === room) {
					allDevices.push(deviceWithType);
				} else if ('location' in device && device.location === room) {
					allDevices.push(deviceWithType);
				}
			});
		});

		return allDevices;
	}

	/**
	 * Get all unique rooms from devices
	 */
	getAllRooms(devices: DeviceCollection): string[] {
		const roomsSet = new Set<string>();

		Object.values(devices).forEach((deviceArray) => {
			deviceArray.forEach((device: any) => {
				if ('room' in device && device.room) {
					roomsSet.add(device.room);
				} else if ('location' in device && device.location) {
					roomsSet.add(device.location);
				}
			});
		});

		return Array.from(roomsSet).sort();
	}

	/**
	 * Get device by ID
	 */
	getDeviceById(deviceMap: Map<string, DeviceWithType>, id: string): DeviceWithType | undefined {
		return deviceMap.get(id);
	}
}

export const deviceService = new DeviceService();
