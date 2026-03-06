import { Gauge } from 'lucide-react';
import type { SensorReading } from './sensor-types';
import { iconMap } from './sensor-types';

interface SmallSensorDisplayProps {
	sensors: SensorReading[];
	textPrimary: string;
	textSecondary: string;
}

export function SmallSensorDisplay({
	sensors,
	textPrimary,
	textSecondary,
}: SmallSensorDisplayProps) {
	return (
		<div className="w-full space-y-0.5">
			{sensors.map((sensor) => {
				const SensorIcon = sensor.icon ? iconMap[sensor.icon] : Gauge;
				return (
					<div key={sensor.id} className="flex items-center justify-between text-xs">
						<span className={`${textSecondary} flex items-center gap-1`}>
							<SensorIcon className="w-3 h-3" />
							{sensor.label}
						</span>
						<span className={`${textPrimary} font-medium`}>
							{sensor.value}
							{sensor.unit ? ` ${sensor.unit}` : ''}
						</span>
					</div>
				);
			})}
		</div>
	);
}
