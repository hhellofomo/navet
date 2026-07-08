import { useMemo } from 'react';
import { DEVICES } from '../data/mock-devices';
import type { DeviceCollection } from '../types/device.types';
import { getAllRooms } from '../utils/device-location';
import { useHADevices } from './use-ha-devices';
import { useHomeAssistant } from './use-home-assistant';

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
  const { connected } = useHomeAssistant();
  const haDevices = useHADevices();
  const fallbackDevices = useMemo(
    () => ({
      ...DEVICES,
      ...haDevices,
    }),
    [haDevices]
  );

  const devices = useMemo(
    () => (connected ? haDevices : fallbackDevices),
    [connected, fallbackDevices, haDevices]
  );

  return devices;
};

/**
 * Hook for getting list of all rooms
 * Extracts unique rooms from devices
 */
export const useRooms = (devices: DeviceCollection): string[] =>
  useMemo(() => getAllRooms(devices), [devices]);
