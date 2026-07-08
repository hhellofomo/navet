import { useMemo } from 'react';
import { deviceService } from '../services/device.service';
import type { DeviceCollection, DeviceWithType } from '../types/device.types';

/**
 * Custom hook for creating and memoizing device map
 * Optimizes performance by preventing unnecessary recalculations
 */
export const useDeviceMap = (devices: DeviceCollection) => {
	const deviceMap = useMemo(() => deviceService.createDeviceMap(devices), [devices]);

	const getDevice = (id: string): DeviceWithType | undefined => {
		return deviceService.getDeviceById(deviceMap, id);
	};

	return { deviceMap, getDevice };
};
