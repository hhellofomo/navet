import type { CardSize } from '../components/card-size-selector';

export interface LightDevice {
  id: string;
  name: string;
  room: string;
  state: boolean;
  brightness: number;
  temp: number;
  size: CardSize;
}

export interface HVACDevice {
  id: string;
  name: string;
  room: string;
  temp: number;
  mode: string;
  size: CardSize;
}

export interface ClimateDevice {
  id: string;
  name: string;
  room: string;
  temperature: number;
  mode: string;
  size: CardSize;
}

export interface PowerDevice {
  id: string;
  name: string;
  room: string;
  percentage: number;
  usage: string;
  cost: string;
  size: CardSize;
}

export interface MediaDevice {
  id: string;
  name: string;
  room: string;
  title: string;
  artist: string;
  size: CardSize;
}

export interface WeatherDevice {
  id: string;
  name: string;
  room: string;
  temperature: number;
  location: string;
  condition: string;
  humidity: number;
  windSpeed: number;
  size: CardSize;
}

export interface WifiDevice {
  id: string;
  name: string;
  room: string;
  networkName: string;
  speed: number;
  uploadSpeed: string;
  downloadSpeed: string;
  size: CardSize;
}

export interface SwitchDevice {
  id: string;
  name: string;
  room: string;
  state: boolean;
  size: CardSize;
  power?: number;
  voltage?: number;
  energy?: number;
}

export interface CoverDevice {
  id: string;
  name: string;
  room: string;
  position: number;
  size: CardSize;
}

export interface LockDevice {
  id: string;
  name: string;
  room: string;
  state: boolean;
  size: CardSize;
}

export interface PersonDevice {
  id: string;
  name: string;
  location: string;
  state: 'home' | 'away';
  size: CardSize;
}

export interface SensorDevice {
  id: string;
  name: string;
  room: string;
  value: string;
  unit: string;
  size: CardSize;
}

export interface GroupedSensorDevice {
  id: string;
  name: string;
  room: string;
  accentColor: string;
  size: CardSize;
  sensors: {
    label: string;
    value: string;
    unit: string;
    icon: string;
  }[];
}

export interface Devices {
  lights: LightDevice[];
  hvac: HVACDevice[];
  climate: ClimateDevice[];
  power: PowerDevice[];
  media: MediaDevice[];
  weather: WeatherDevice[];
  wifi: WifiDevice[];
  switches: SwitchDevice[];
  covers: CoverDevice[];
  locks: LockDevice[];
  persons: PersonDevice[];
  sensors: SensorDevice[];
  'grouped-sensors': GroupedSensorDevice[];
}

export const devices: Devices = {
  lights: [],
  hvac: [
    {
      id: 'hvac-1',
      name: 'Air Conditioner',
      room: 'Living Room',
      temp: 21,
      mode: 'Cool',
      size: 'medium',
    },
    { id: 'hvac-2', name: 'AC Unit', room: 'Bedroom', temp: 19, mode: 'Cool', size: 'medium' },
  ],
  climate: [
    {
      id: 'climate-1',
      name: 'Climate Hub',
      room: 'Living Room',
      temperature: 22,
      mode: 'Cooling',
      size: 'medium',
    },
  ],
  power: [
    {
      id: 'power-1',
      name: 'Power Monitor',
      room: 'Living Room',
      percentage: 68,
      usage: '2.4 kW',
      cost: '2.30',
      size: 'medium',
    },
  ],
  media: [
    {
      id: 'media-1',
      name: 'Media Player',
      room: 'Living Room',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      size: 'large',
    },
  ],
  weather: [
    {
      id: 'weather-1',
      name: 'Weather',
      room: 'Living Room',
      temperature: 19,
      location: 'Valencia, Spain',
      condition: 'Cloudy',
      humidity: 65,
      windSpeed: 12,
      size: 'large',
    },
  ],
  wifi: [
    {
      id: 'wifi-1',
      name: 'Wi-Fi Network',
      room: 'Living Room',
      networkName: 'HomeAssistant_5G',
      speed: 120,
      uploadSpeed: '24',
      downloadSpeed: '119.8%',
      size: 'medium',
    },
  ],
  switches: [
    { id: 'switch-1', name: 'Feed Mengel', room: 'Kitchen', state: false, size: 'small' },
    {
      id: 'switch-2',
      name: 'Indoor Projector',
      room: 'Living Room',
      state: true,
      size: 'small',
      power: 245,
      voltage: 120,
      energy: 1.8,
    },
    { id: 'switch-3', name: 'Shirt Heater', room: 'Bathroom', state: false, size: 'small' },
  ],
  covers: [
    { id: 'cover-1', name: '1 TEL Dilca Doe 3', room: 'Living Room', position: 0, size: 'small' },
    { id: 'cover-2', name: 'Bedroom Blinds', room: 'Bedroom', position: 50, size: 'small' },
  ],
  locks: [
    { id: 'lock-1', name: 'Door', room: 'Living Room', state: true, size: 'small' },
    { id: 'lock-2', name: 'Front Door', room: 'Kitchen', state: true, size: 'small' },
  ],
  persons: [
    { id: 'person-1', name: 'Julia', location: 'Office', state: 'home', size: 'small' },
    { id: 'person-2', name: 'Hoofdkasset', location: 'Away', state: 'away', size: 'small' },
  ],
  sensors: [
    {
      id: 'sensor-1',
      name: 'Temperature',
      room: 'Living Room',
      value: '22',
      unit: '°C',
      size: 'small',
    },
    { id: 'sensor-2', name: 'Humidity', room: 'Bathroom', value: '65', unit: '%', size: 'small' },
  ],
  'grouped-sensors': [
    {
      id: 'energy-sensors-1',
      name: 'Energy Monitor',
      room: 'Living Room',
      accentColor: 'amber',
      size: 'medium',
      sensors: [
        { label: 'Today', value: '12.4', unit: 'kWh', icon: 'zap' },
        { label: 'Current', value: '2.3', unit: 'kW', icon: 'activity' },
        { label: 'Bathroom', value: '450', unit: 'W', icon: 'zap' },
        { label: 'Kitchen', value: '1.2', unit: 'kW', icon: 'zap' },
      ],
    },
    {
      id: 'climate-sensors-1',
      name: 'Climate Sensors',
      room: 'Bedroom',
      accentColor: 'blue',
      size: 'medium',
      sensors: [
        { label: 'Temperature', value: '21', unit: '°C', icon: 'thermometer' },
        { label: 'Humidity', value: '55', unit: '%', icon: 'droplets' },
        { label: 'Air Quality', value: 'Good', unit: '', icon: 'wind' },
      ],
    },
  ],
};
