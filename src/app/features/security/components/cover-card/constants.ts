import { Blinds, DoorOpen, Fence, Home, ShieldCheck, SunDim } from 'lucide-react';
import type { DeviceClass, DeviceClassConfig } from './types';

export const DEVICE_CLASS_CONFIG: Record<DeviceClass, DeviceClassConfig> = {
  blind: { label: 'Window Blinds', icon: Blinds },
  shade: { label: 'Roller Shades', icon: Blinds },
  curtain: { label: 'Curtains', icon: Home },
  garage: { label: 'Garage Doors', icon: DoorOpen },
  gate: { label: 'Gates', icon: Fence },
  awning: { label: 'Awnings', icon: SunDim },
  shutter: { label: 'Shutters', icon: ShieldCheck },
  door: { label: 'Doors', icon: DoorOpen },
};
