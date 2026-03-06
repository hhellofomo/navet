import { Gauge } from 'lucide-react';
import { memo } from 'react';
import { useTheme } from '../contexts/theme-context';
import { type CardSize, CardSizeSelector } from './card-size-selector';
import { SensorGroupSettingsDialog } from './sensor-group-settings-dialog';
import { GridSensorDisplay } from './sensors/grid-sensor-display';
import { darkColorMap, lightColorMap } from './sensors/sensor-colors';
import type { SensorReading } from './sensors/sensor-types';
import { iconMap } from './sensors/sensor-types';
import { SmallSensorDisplay } from './sensors/small-sensor-display';
import { useSensorGroup } from './sensors/use-sensor-group';

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

export const GroupedSensorCard = memo(function GroupedSensorCard({
	id,
	name,
	_room,
	sensors,
	size,
	onSizeChange,
	isEditMode,
	accentColor = 'teal',
}: GroupedSensorCardProps) {
	const {
		selectedSensors,
		isSettingsOpen,
		setIsSettingsOpen,
		handleSensorsUpdate,
		visibleSensors,
	} = useSensorGroup({ initialSensors: sensors });
	const { theme } = useTheme();

	// Size-specific styling with intelligent layout adaptation
	const isSmall = size === 'small';
	const isMedium = size === 'medium';
	const _isLarge = size === 'large';
	const padding = isSmall ? 'p-4' : 'p-5';

	const colors = theme === 'light' ? lightColorMap[accentColor] : darkColorMap[accentColor];
	const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
	const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-gray-400';

	// Get primary icon (first sensor's icon or default)
	const PrimaryIcon = selectedSensors[0]?.icon ? iconMap[selectedSensors[0].icon] : Gauge;

	// Maximum 4 sensors allowed
	const MAX_SENSORS = 4;

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
				type="button"
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
							<h3
								className={`font-semibold ${textPrimary} truncate ${isSmall ? 'text-xs' : 'text-sm'}`}
							>
								{name}
							</h3>
						</div>
						<div
							className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0`}
						>
							<PrimaryIcon className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} ${colors.iconColor}`} />
						</div>
					</div>

					{/* Sensor Grid */}
					<div className="flex-1 flex items-end min-h-0">
						{isSmall ? (
							<SmallSensorDisplay
								sensors={visibleSensors}
								textPrimary={textPrimary}
								textSecondary={textSecondary}
							/>
						) : (
							<GridSensorDisplay
								sensors={visibleSensors}
								textPrimary={textPrimary}
								textSecondary={textSecondary}
								colors={colors}
								isMedium={isMedium}
							/>
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
