import { Sun, CloudSun, Moon, Sparkles } from 'lucide-react';

export const TEMP_OPTIONS = [
  { value: 2700, color: '#FFB366', label: 'Warm' },
  { value: 3000, color: '#FFD4A3', label: 'Soft' },
  { value: 4000, color: '#FFF4E6', label: 'Neutral' },
  { value: 5000, color: '#F0F8FF', label: 'Cool' },
  { value: 6500, color: '#E6F2FF', label: 'Daylight' }
];

export const PRESET_COLORS = [
  '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9'
];

export const BRIGHTNESS_PRESETS = [
  { icon: Sun, brightness: 100, label: 'Bright' },
  { icon: CloudSun, brightness: 75, label: 'Normal' },
  { icon: Moon, brightness: 50, label: 'Dim' },
  { icon: Sparkles, brightness: 25, label: 'Night' }
];