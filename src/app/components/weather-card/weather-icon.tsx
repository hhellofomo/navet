import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  Wind as WindIcon,
  Sunrise,
  Sunset
} from 'lucide-react';

export type WeatherCondition = 
  | 'Clear' 
  | 'Cloudy' 
  | 'Rainy' 
  | 'Snowy' 
  | 'Drizzle' 
  | 'Fog' 
  | 'Thunderstorm' 
  | 'Partly Cloudy'
  | 'Sunny';

interface WeatherIconProps {
  condition: WeatherCondition | string;
  className?: string;
}

/**
 * Weather Icon Component
 * Returns appropriate icon based on weather condition
 */
export const WeatherIcon = ({ condition, className = 'w-6 h-6' }: WeatherIconProps) => {
  const iconProps = { className: `${className} text-cyan-300` };
  
  switch (condition.toLowerCase()) {
    case 'clear':
    case 'sunny':
      return <Sun {...iconProps} />;
    case 'cloudy':
    case 'overcast':
      return <Cloud {...iconProps} />;
    case 'partly cloudy':
      return <Cloud {...iconProps} />;
    case 'rainy':
    case 'rain':
      return <CloudRain {...iconProps} />;
    case 'snowy':
    case 'snow':
      return <CloudSnow {...iconProps} />;
    case 'drizzle':
      return <CloudDrizzle {...iconProps} />;
    case 'fog':
    case 'mist':
      return <CloudFog {...iconProps} />;
    case 'thunderstorm':
    case 'storm':
      return <CloudLightning {...iconProps} />;
    default:
      return <Cloud {...iconProps} />;
  }
};