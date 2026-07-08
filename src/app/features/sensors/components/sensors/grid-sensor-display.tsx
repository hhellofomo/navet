import { Gauge } from 'lucide-react';
import type { SensorReading } from './sensor-types';
import { iconMap } from './sensor-types';

interface GridSensorDisplayProps {
  sensors: SensorReading[];
  textPrimary: string;
  textSecondary: string;
  colors: { accent: string };
  isMedium: boolean;
}

export function GridSensorDisplay({
  sensors,
  textPrimary,
  textSecondary,
  colors,
  isMedium,
}: GridSensorDisplayProps) {
  return (
    <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2">
      {sensors.map((sensor) => {
        const SensorIcon = sensor.icon ? iconMap[sensor.icon] : Gauge;
        return (
          <div key={sensor.id} className="flex flex-col">
            <span className={`text-xs ${textSecondary} truncate mb-1 flex items-center gap-1`}>
              <SensorIcon className="w-3 h-3 flex-shrink-0" />
              {sensor.label}
            </span>
            <div>
              <span
                className={`${isMedium ? 'text-xl' : 'text-2xl'} font-bold ${textPrimary} leading-none`}
              >
                {sensor.value}
              </span>
              <span className={`text-sm ${colors.accent} ml-1`}>{sensor.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
