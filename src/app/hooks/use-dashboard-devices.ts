import { useMemo } from 'react';
import type { DashboardEntityMode } from '../stores/dashboard-entities-store';
import type { DeviceCollection } from '../types/device.types';

export const useDashboardDevices = (
  devices: DeviceCollection,
  mode: DashboardEntityMode,
  manualEntityIds: string[]
): DeviceCollection => {
  return useMemo(() => {
    if (mode === 'auto') {
      return devices;
    }

    const allowedIds = new Set(manualEntityIds);

    return {
      lights: devices.lights.filter((device) => allowedIds.has(device.id)),
      hvac: devices.hvac.filter((device) => allowedIds.has(device.id)),
      climate: devices.climate.filter((device) => allowedIds.has(device.id)),
      power: devices.power.filter((device) => allowedIds.has(device.id)),
      media: devices.media.filter((device) => allowedIds.has(device.id)),
      weather: devices.weather.filter((device) => allowedIds.has(device.id)),
      wifi: devices.wifi.filter((device) => allowedIds.has(device.id)),
      switches: devices.switches.filter((device) => allowedIds.has(device.id)),
      covers: devices.covers.filter((device) => allowedIds.has(device.id)),
      locks: devices.locks.filter((device) => allowedIds.has(device.id)),
      persons: devices.persons.filter((device) => allowedIds.has(device.id)),
      sensors: devices.sensors.filter((device) => allowedIds.has(device.id)),
      vacuums: devices.vacuums.filter((device) => allowedIds.has(device.id)),
      rssFeeds: devices.rssFeeds.filter((device) => allowedIds.has(device.id)),
      calendars: devices.calendars.filter((device) => allowedIds.has(device.id)),
      'grouped-sensors': devices['grouped-sensors'].filter((device) => allowedIds.has(device.id)),
    };
  }, [devices, manualEntityIds, mode]);
};
