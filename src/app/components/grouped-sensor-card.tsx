import { memo, useState } from 'react';
import { Zap, Thermometer, Droplets, Gauge, TrendingUp, TrendingDown, Activity, Wind, Sun } from 'lucide-react';
import { CardSizeSelector, type CardSize } from './card-size-selector';
import { SensorGroupSettingsDialog } from './sensor-group-settings-dialog';
import { CaptionValue } from './ui/caption-value';
import { useTheme } from '../contexts/theme-context';
import type { LucideIcon } from 'lucide-react';

export type SensorIconType = 'zap' | 'thermometer' | 'droplets' | 'gauge' | 'trend-up' | 'trend-down' | 'activity' | 'wind' | 'sun';

interface SensorReading {
  label: string;
  value: string;
  unit: string;
  icon?: SensorIconType;
}

interface GroupedSensorCardProps {
  id: string;
  name: string;
  room: string;
  sensors: SensorReading[];
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
  accentColor?: 'teal' | 'blue' | 'purple' | 'amber' | 'emerald';
}

const iconMap: Record<SensorIconType, LucideIcon> = {
  zap: Zap,
  thermometer: Thermometer,
  droplets: Droplets,
  gauge: Gauge,
  'trend-up': TrendingUp,
  'trend-down': TrendingDown,
  activity: Activity,
  wind: Wind,
  sun: Sun,
};

const darkColorMap = {
  teal: {
    gradient: 'from-teal-900/90 to-teal-950/95',
    border: 'border-teal-700/30',
    iconBg: 'bg-teal-500/20',
    iconColor: 'text-teal-400',
    accent: 'text-teal-400',
    glow: 'from-teal-500/10',
  },
  blue: {
    gradient: 'from-blue-900/90 to-blue-950/95',
    border: 'border-blue-700/30',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    accent: 'text-blue-400',
    glow: 'from-blue-500/10',
  },
  purple: {
    gradient: 'from-purple-900/90 to-purple-950/95',
    border: 'border-purple-700/30',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    accent: 'text-purple-400',
    glow: 'from-purple-500/10',
  },
  amber: {
    gradient: 'from-amber-900/90 to-amber-950/95',
    border: 'border-amber-700/30',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    accent: 'text-amber-400',
    glow: 'from-amber-500/10',
  },
  emerald: {
    gradient: 'from-emerald-900/90 to-emerald-950/95',
    border: 'border-emerald-700/30',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    accent: 'text-emerald-400',
    glow: 'from-emerald-500/10',
  },
};

const lightColorMap = {
  teal: {
    gradient: 'from-white to-teal-50/80',
    border: 'border-gray-200/80',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    accent: 'text-teal-700',
    glow: 'from-teal-50/40',
  },
  blue: {
    gradient: 'from-white to-blue-50/80',
    border: 'border-gray-200/80',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    accent: 'text-blue-700',
    glow: 'from-blue-50/40',
  },
  purple: {
    gradient: 'from-white to-purple-50/80',
    border: 'border-gray-200/80',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    accent: 'text-purple-700',
    glow: 'from-purple-50/40',
  },
  amber: {
    gradient: 'from-white to-amber-50/80',
    border: 'border-gray-200/80',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    accent: 'text-amber-700',
    glow: 'from-amber-50/40',
  },
  emerald: {
    gradient: 'from-white to-emerald-50/80',
    border: 'border-gray-200/80',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    accent: 'text-emerald-700',
    glow: 'from-emerald-50/40',
  },
};

export const GroupedSensorCard = memo(function GroupedSensorCard({ 
  id,
  name, 
  room, 
  sensors,
  size, 
  onSizeChange, 
  isEditMode,
  accentColor = 'teal'
}: GroupedSensorCardProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedSensors, setSelectedSensors] = useState<SensorReading[]>(sensors);
  const { theme } = useTheme();
  
  // Size-specific styling with intelligent layout adaptation
  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const padding = isSmall ? 'p-4' : 'p-5';
  
  const colors = theme === 'light' ? lightColorMap[accentColor] : darkColorMap[accentColor];
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  
  // Get primary icon (first sensor's icon or default)
  const PrimaryIcon = selectedSensors[0]?.icon ? iconMap[selectedSensors[0].icon] : Gauge;
  
  // Maximum 4 sensors allowed
  const MAX_SENSORS = 4;
  
  // Determine layout based on size and number of sensors
  const getSensorLayout = () => {
    if (isSmall) {
      // Small: Show all 4 sensors in vertical stack
      return selectedSensors.slice(0, 4);
    } else if (isMedium) {
      // Medium: Show max 4 sensors in 2x2 grid
      return selectedSensors.slice(0, 4);
    } else {
      // Large: Show max 4 sensors in 2x2 grid
      return selectedSensors.slice(0, 4);
    }
  };
  
  const visibleSensors = getSensorLayout();
  
  const handleSensorsUpdate = (newSensors: SensorReading[]) => {
    setSelectedSensors(newSensors.slice(0, MAX_SENSORS));
  };
  
  return (
    <div className="h-full w-full relative">
      {isEditMode && (
        <CardSizeSelector 
          currentSize={size} 
          onSizeChange={(newSize) => onSizeChange(id, newSize)} 
          allowedSizes={['small', 'medium']}
        />
      )}
      
      <button
        onClick={() => setIsSettingsOpen(true)}
        className={`relative h-full w-full bg-gradient-to-br ${colors.gradient} backdrop-blur-xl rounded-3xl ${padding} border ${colors.border} overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform text-left ${theme === 'light' ? 'shadow-lg' : ''}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} to-transparent`}></div>
        
        {/* Light theme frosted overlay */}
        {theme === 'light' && <div className="absolute inset-0 bg-white/60" />}
        
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className={`flex items-start justify-between ${isSmall ? 'mb-2' : 'mb-3'}`}>
            <div className="min-w-0 flex-1">
              <h3 className={`font-semibold ${textPrimary} truncate ${isSmall ? 'text-xs' : 'text-sm'}`}>{name}</h3>
            </div>
            <div className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
              <PrimaryIcon className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} ${colors.iconColor}`} />
            </div>
          </div>

          {/* Sensor Grid */}
          <div className="flex-1 flex items-end min-h-0">
            {isSmall ? (
              // SMALL: Vertical stack with icons (all 4 sensors, bottom-aligned)
              <div className="w-full space-y-0.5">
                {visibleSensors.map((sensor, index) => {
                  const SensorIcon = sensor.icon ? iconMap[sensor.icon] : Gauge;
                  return (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className={`${textSecondary} flex items-center gap-1`}>
                        <SensorIcon className="w-3 h-3" />
                        {sensor.label}
                      </span>
                      <span className={`${textPrimary} font-medium`}>{sensor.value}{sensor.unit ? ` ${sensor.unit}` : ''}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              // MEDIUM & LARGE: 2x2 grid of sensors (max 4)
              <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2">
                {visibleSensors.map((sensor, index) => {
                  const SensorIcon = sensor.icon ? iconMap[sensor.icon] : Gauge;
                  return (
                    <div key={index} className="flex flex-col">
                      <span className={`text-xs ${textSecondary} truncate mb-1 flex items-center gap-1`}>
                        <SensorIcon className="w-3 h-3 flex-shrink-0" />
                        {sensor.label}
                      </span>
                      <div>
                        <span className={`${isMedium ? 'text-xl' : 'text-2xl'} font-bold ${textPrimary} leading-none`}>{sensor.value}</span>
                        <span className={`text-sm ${colors.accent} ml-1`}>{sensor.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </button>

      <SensorGroupSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        groupName={name}
        currentSensors={selectedSensors}
        maxSensors={MAX_SENSORS}
        accentColor={accentColor}
        onSensorsUpdate={handleSensorsUpdate}
      />
    </div>
  );
});