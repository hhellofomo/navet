import type { Device, DeviceCollection, DeviceWithType } from '../types/device.types';
import { getAllRooms, getDeviceRoom } from '../utils/device-location';

/**
 * Device Service
 * Handles all device data operations
 * In production, this would make API calls
 */
class DeviceService {
  private withType(device: Device, type: keyof DeviceCollection): DeviceWithType {
    return { ...device, type } as DeviceWithType;
  }

  /**
   * Create a device map for quick lookups by ID
   */
  createDeviceMap(devices: DeviceCollection): Map<string, DeviceWithType> {
    const deviceMap = new Map<string, DeviceWithType>();

    Object.entries(devices).forEach(([type, deviceArray]) => {
      (deviceArray as Device[]).forEach((device: Device) => {
        deviceMap.set(device.id, this.withType(device, type as keyof DeviceCollection));
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
      (deviceArray as Device[]).forEach((device: Device) => {
        const deviceWithType = this.withType(device, type as keyof DeviceCollection);

        if (getDeviceRoom(device) === room) {
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
    return getAllRooms(devices);
  }

  /**
   * Get device by ID
   */
  getDeviceById(deviceMap: Map<string, DeviceWithType>, id: string): DeviceWithType | undefined {
    return deviceMap.get(id);
  }
}

export const deviceService = new DeviceService();
