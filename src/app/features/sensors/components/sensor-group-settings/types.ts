import type { SensorIconType, SensorReading } from '../sensors';

export interface AvailableSensor {
  id: string;
  label: string;
  value: string;
  unit: string;
  icon: SensorIconType;
  category: 'energy' | 'climate' | 'environmental' | 'other';
}

export interface SensorGroupSettingsDialogProps {
  entityId: string;
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  currentSensors: SensorReading[];
  maxSensors: number;
  accentColor: 'teal' | 'blue' | 'purple' | 'amber' | 'emerald';
  onSensorsUpdate: (sensors: SensorReading[]) => void;
}

export interface SensorGroupColorConfig {
  iconBg: string;
  iconColor: string;
  hover: string;
  selected: string;
}
