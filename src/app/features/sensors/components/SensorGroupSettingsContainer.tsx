import * as Dialog from '@radix-ui/react-dialog';
import type { LucideIcon } from 'lucide-react';
import { memo, useCallback, useRef, useState } from 'react';
import { CustomScrollbar } from '../../shared/components/custom-scrollbar';
import { iconMap, type SensorIconType } from './sensors/sensor-types';
import { SensorGroupSettingsView } from './SensorGroupSettingsView';

interface SensorReading {
	label: string;
	value: string;
	unit: string;
	icon?: SensorIconType;
}

interface AvailableSensor {
	id: string;
	label: string;
	value: string;
	unit: string;
	icon: SensorIconType;
	category: 'energy' | 'climate' | 'environmental' | 'other';
}

interface SensorGroupSettingsContainerProps {
	isOpen: boolean;
	onClose: () => void;
	groupName: string;
	currentSensors: SensorReading[];
	maxSensors: number;
	accentColor: 'teal' | 'blue' | 'purple' | 'amber' | 'emerald';
	onSensorsUpdate: (sensors: SensorReading[]) => void;
}

// Available sensors that can be added
const AVAILABLE_SENSORS: AvailableSensor[] = [
	// Energy sensors
	{
		id: 'energy-today',
		label: 'Today',
		value: '12.4',
		unit: 'kWh',
		icon: 'zap',
		category: 'energy',
	},
	{
		id: 'energy-current',
		label: 'Current',
		value: '2.3',
		unit: 'kW',
		icon: 'activity',
		category: 'energy',
	},
	{
		id: 'energy-bathroom',
		label: 'Bathroom',
		value: '450',
		unit: 'W',
		icon: 'zap',
		category: 'energy',
	},
	{
		id: 'energy-kitchen',
		label: 'Kitchen',
		value: '1.2',
		unit: 'kW',
		icon: 'zap',
		category: 'energy',
	},
	{
		id: 'energy-bedroom',
		label: 'Bedroom',
		value: '320',
		unit: 'W',
		icon: 'zap',
		category: 'energy',
	},
	{
		id: 'energy-living',
		label: 'Living Room',
		value: '890',
		unit: 'W',
		icon: 'zap',
		category: 'energy',
	},
	{
		id: 'energy-week',
		label: 'This Week',
		value: '84.2',
		unit: 'kWh',
		icon: 'trend-up',
		category: 'energy',
	},
	{
		id: 'energy-month',
		label: 'This Month',
		value: '342',
		unit: 'kWh',
		icon: 'trend-up',
		category: 'energy',
	},

	// Climate sensors
	{
		id: 'temp-indoor',
		label: 'Temperature',
		value: '21',
		unit: '°C',
		icon: 'thermometer',
		category: 'climate',
	},
	{
		id: 'humidity-indoor',
		label: 'Humidity',
		value: '55',
		unit: '%',
		icon: 'droplets',
		category: 'climate',
	},
	{
		id: 'temp-outdoor',
		label: 'Outdoor Temp',
		value: '18',
		unit: '°C',
		icon: 'thermometer',
		category: 'climate',
	},
	{
		id: 'humidity-outdoor',
		label: 'Outdoor Humidity',
		value: '72',
		unit: '%',
		icon: 'droplets',
		category: 'climate',
	},
	{
		id: 'temp-bedroom',
		label: 'Bedroom Temp',
		value: '19',
		unit: '°C',
		icon: 'thermometer',
		category: 'climate',
	},
	{
		id: 'humidity-bedroom',
		label: 'Bedroom Humidity',
		value: '48',
		unit: '%',
		icon: 'droplets',
		category: 'climate',
	},

	// Environmental sensors
	{
		id: 'air-quality',
		label: 'Air Quality',
		value: 'Good',
		unit: '',
		icon: 'wind',
		category: 'environmental',
	},
	{
		id: 'wind-speed',
		label: 'Wind Speed',
		value: '12',
		unit: 'km/h',
		icon: 'wind',
		category: 'environmental',
	},
	{
		id: 'uv-index',
		label: 'UV Index',
		value: '5',
		unit: '',
		icon: 'sun',
		category: 'environmental',
	},
	{
		id: 'pressure',
		label: 'Pressure',
		value: '1013',
		unit: 'hPa',
		icon: 'gauge',
		category: 'environmental',
	},
	{
		id: 'co2',
		label: 'CO2 Level',
		value: '420',
		unit: 'ppm',
		icon: 'wind',
		category: 'environmental',
	},

	// Other sensors
	{
		id: 'noise-level',
		label: 'Noise Level',
		value: '42',
		unit: 'dB',
		icon: 'activity',
		category: 'other',
	},
	{
		id: 'light-level',
		label: 'Light Level',
		value: '450',
		unit: 'lux',
		icon: 'sun',
		category: 'other',
	},
];

const colorMap = {
	teal: {
		iconBg: 'bg-teal-500/20',
		iconColor: 'text-teal-400',
		hover: 'hover:bg-teal-500/10',
		selected: 'bg-teal-500/20 border-teal-500/40',
	},
	blue: {
		iconBg: 'bg-blue-500/20',
		iconColor: 'text-blue-400',
		hover: 'hover:bg-blue-500/10',
		selected: 'bg-blue-500/20 border-blue-500/40',
	},
	purple: {
		iconBg: 'bg-purple-500/20',
		iconColor: 'text-purple-400',
		hover: 'hover:bg-purple-500/10',
		selected: 'bg-purple-500/20 border-purple-500/40',
	},
	amber: {
		iconBg: 'bg-amber-500/20',
		iconColor: 'text-amber-400',
		hover: 'hover:bg-amber-500/10',
		selected: 'bg-amber-500/20 border-amber-500/40',
	},
	emerald: {
		iconBg: 'bg-emerald-500/20',
		iconColor: 'text-emerald-400',
		hover: 'hover:bg-emerald-500/10',
		selected: 'bg-emerald-500/20 border-emerald-500/40',
	},
};

export const SensorGroupSettingsContainer = memo(function SensorGroupSettingsContainer({
	isOpen,
	onClose,
	groupName,
	currentSensors,
	maxSensors,
	accentColor,
	onSensorsUpdate,
}: SensorGroupSettingsContainerProps) {
	const [selectedSensors, setSelectedSensors] = useState<SensorReading[]>(currentSensors);
	const [searchQuery, setSearchQuery] = useState('');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const colors = colorMap[accentColor];

	// Filter sensors based on search query — searches label, category, unit, and id
	const filteredSensors = AVAILABLE_SENSORS.filter((sensor) => {
		const query = searchQuery.toLowerCase().trim();
		if (!query) return true; // Show all when no query
		return (
			sensor.label.toLowerCase().includes(query) ||
			sensor.category.toLowerCase().includes(query) ||
			sensor.unit.toLowerCase().includes(query) ||
			sensor.id.toLowerCase().includes(query)
		);
	});

	const handleAddSensor = useCallback(
		(sensor: AvailableSensor) => {
			if (selectedSensors.length >= maxSensors) return;

			// Check if already selected
			const alreadySelected = selectedSensors.some((s) =>
				AVAILABLE_SENSORS.find((as) => as.id === sensor.id && as.label === s.label)
			);
			if (alreadySelected) return;

			const newSensor: SensorReading = {
				label: sensor.label,
				value: sensor.value,
				unit: sensor.unit,
				icon: sensor.icon,
			};

			setSelectedSensors([...selectedSensors, newSensor]);
			setSearchQuery('');
			setHighlightedIndex(-1);
			// Keep dropdown open and refocus input for quick multi-add
			setTimeout(() => inputRef.current?.focus(), 0);
		},
		[selectedSensors, maxSensors]
	);

	const handleRemoveSensor = (index: number) => {
		const newSensors = selectedSensors.filter((_, i) => i !== index);
		setSelectedSensors(newSensors);
	};

	const handleSave = () => {
		onSensorsUpdate(selectedSensors);
		onClose();
	};

	const handleCancel = () => {
		setSelectedSensors(currentSensors);
		setSearchQuery('');
		setIsDropdownOpen(false);
		setHighlightedIndex(-1);
		onClose();
	};

	const isSensorSelected = (sensorId: string) => {
		return selectedSensors.some((s) =>
			AVAILABLE_SENSORS.find((as) => as.id === sensorId && as.label === s.label)
		);
	};

	return (
		<Dialog.Root
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) handleCancel();
			}}
		>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
				<SensorGroupSettingsView
					groupName={groupName}
					selectedSensors={selectedSensors}
					maxSensors={maxSensors}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					isDropdownOpen={isDropdownOpen}
					setIsDropdownOpen={setIsDropdownOpen}
					highlightedIndex={highlightedIndex}
					setHighlightedIndex={setHighlightedIndex}
					inputRef={inputRef}
					colors={colors}
					filteredSensors={filteredSensors}
					iconMap={iconMap}
					handleAddSensor={handleAddSensor}
					handleRemoveSensor={handleRemoveSensor}
					handleSave={handleSave}
					handleCancel={handleCancel}
					isSensorSelected={isSensorSelected}
					CustomScrollbar={CustomScrollbar}
				/>
			</Dialog.Portal>
		</Dialog.Root>
	);
});
