import { useMemo } from 'react';
import { useHomeAssistantContext } from '../contexts/home-assistant-context';
import { DEVICES } from '../data/mock-devices';
import type { DeviceCollection } from '../types/device.types';
import { useHADevices } from './use-ha-devices';

/**
 * Custom hook for managing devices
 * In production, this would use React Query to fetch from API:
 *
 * export const useDevices = () => {
 *   return useQuery({
 *     queryKey: ['devices'],
 *     queryFn: () => deviceService.fetchDevices(),
 *     staleTime: 30000, // 30 seconds
 *     refetchInterval: 60000, // refetch every minute
 *   });
 * };
 *
 * For now, returns mock data
 */
export const useDevices = (): DeviceCollection => {
  const { connected } = useHomeAssistantContext();
  const haDevices = useHADevices();

  const devices = useMemo(
    () => (connected ? haDevices : { ...DEVICES, lights: haDevices.lights }),
    [connected, haDevices]
  );

  return devices;
};

/**
 * Hook for getting list of all rooms
 * Extracts unique rooms from devices
 */
export const useRooms = (devices: DeviceCollection): string[] => {
  return useMemo(() => {
    const roomsSet = new Set<string>();

    Object.values(devices).forEach((deviceArray) => {
      deviceArray.forEach((device) => {
        if ('room' in device && device.room) {
          roomsSet.add(device.room);
        } else if ('location' in device && device.location) {
          roomsSet.add(device.location);
        }
      });
    });

    return Array.from(roomsSet);
  }, [devices]);
};
