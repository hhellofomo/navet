import type { DeviceCollection } from '../types/device.types';

export const DEVICE_TYPE_LABELS: Record<keyof DeviceCollection, string> = {
  lights: 'Light',
  hvac: 'HVAC',
  climate: 'Climate',
  power: 'Power',
  media: 'Media',
  weather: 'Weather',
  wifi: 'Wi-Fi',
  switches: 'Switch',
  covers: 'Cover',
  locks: 'Lock',
  persons: 'Person',
  sensors: 'Sensor',
  vacuums: 'Vacuum',
  rssFeeds: 'RSS Feed',
  calendars: 'Calendar',
  'grouped-sensors': 'Sensor Group',
};

export function getDeviceTypeLabel(type: string): string {
  return DEVICE_TYPE_LABELS[type as keyof DeviceCollection] ?? type;
}
