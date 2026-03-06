import { Power } from 'lucide-react';
import { memo, useState } from 'react';
import { useTheme } from '@/app/contexts/theme-context';
import { iconMap } from '@/app/features/sensors/components/sensors/sensor-types';
import type { DeviceMetric } from '@/app/types/device.types';

interface SwitchCardProps {
	name: string;
	room: string;
	initialState?: boolean;
	entityType?: string;
	power?: number; // Current power in watts
	voltage?: number; // Voltage
	energy?: number; // Energy consumption in kWh
	metrics?: DeviceMetric[];
	isEditMode?: boolean;
}

export const SwitchCard = memo(function SwitchCard({
	name,
	initialState = false,
	entityType = 'Switch',
	power,
	voltage,
	energy,
	metrics,
	isEditMode = false,
}: Omit<SwitchCardProps, 'room'>) {
	const [isOn, setIsOn] = useState(initialState);
	const { colors, theme } = useTheme();

	const formatPower = (watts?: number) => {
		if (!watts) return null;
		if (watts >= 1000) return `${(watts / 1000).toFixed(1)} kW`;
		return `${watts} W`;
	};

	const fallbackMetrics: DeviceMetric[] = [
		...(power != null
			? [{ label: 'Power', value: power, unit: 'W', icon: 'zap' as const, category: 'measurement' as const }]
			: []),
		...(voltage != null
			? [{ label: 'Voltage', value: voltage, unit: 'V', icon: 'gauge' as const, category: 'measurement' as const }]
			: []),
		...(energy != null
			? [{ label: 'Energy', value: energy, unit: 'kWh', icon: 'activity' as const, category: 'measurement' as const }]
			: []),
	];
	const allMetrics = metrics?.length ? metrics : fallbackMetrics;
	const visibleMetrics = allMetrics.filter(
		(metric) => isOn || metric.category === 'configuration'
	);
	const hasMetrics = visibleMetrics.length > 0;

	const cardColors = isOn
		? colors.switch.on
		: {
				gradient: colors.light.gradient,
				border: colors.light.border,
				iconBg: colors.light.iconBg,
				accent: theme === 'light' ? 'text-gray-400' : 'text-gray-500',
				glow: colors.light.glow,
			};
	const textColor =
		theme === 'light'
			? isOn
				? 'text-gray-900'
				: 'text-gray-500'
			: isOn
				? 'text-white'
				: 'text-gray-500';
	const valueColor = theme === 'light' ? 'text-gray-900' : 'text-white';
	const labelColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
	const iconBadgeClass =
		theme === 'light'
			? isOn
				? 'bg-blue-200/80'
				: 'bg-gray-300/70'
			: cardColors.iconBg;
	const iconColorClass =
		theme === 'light'
			? isOn
				? 'text-blue-700'
				: 'text-gray-600'
			: cardColors.accent;

	return (
		<button
			type="button"
			onClick={() => {
				if (isEditMode) {
					return;
				}
				setIsOn(!isOn);
			}}
			className={`relative h-full w-full bg-gradient-to-br ${cardColors.gradient} backdrop-blur-xl rounded-3xl p-4 border ${cardColors.border} overflow-hidden transition-all duration-500 ${
				isEditMode
					? 'cursor-move active:cursor-grabbing'
					: 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
			} ${!isOn ? 'grayscale opacity-40' : ''} ${theme === 'light' && isOn ? 'shadow-lg' : ''}`}
		>
			<div
				className={`absolute inset-0 bg-gradient-to-br ${cardColors.glow} to-transparent transition-all duration-500`}
			></div>

			{/* Light theme frosted overlay */}
			{theme === 'light' && <div className="absolute inset-0 bg-white/60" />}

			<div className="relative h-full flex flex-col">
				<div className="flex items-start justify-between mb-2">
					<div className="min-w-0 flex-1">
						<h3
							className={`font-semibold text-xs ${textColor} transition-colors duration-500 truncate text-left`}
						>
							{name}
						</h3>
						<p className="text-[10px] text-gray-400 truncate mt-0.5 text-left">
							{entityType}
						</p>
					</div>
					<div
						className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${iconBadgeClass}`}
					>
						<Power className={`w-4 h-4 transition-colors duration-500 ${iconColorClass}`} />
					</div>
				</div>

				<div className="flex-1"></div>

				{/* Metrics display */}
				{hasMetrics && (
					<div className="space-y-0.5">
						{visibleMetrics.map((metric) => {
							const Icon = iconMap[metric.icon] ?? Power;
							const formattedValue =
								typeof metric.value === 'number'
									? metric.label === 'Power'
										? formatPower(metric.value)
										: `${metric.value.toFixed(metric.unit === 'kWh' ? 2 : 0)}${metric.unit ? ` ${metric.unit}` : ''}`
									: metric.value;

							return (
								<div key={metric.label} className="flex items-center justify-between text-xs">
									<span className={`${labelColor} min-w-0 flex items-center gap-1 pr-2`}>
										<Icon className="h-3 w-3 flex-shrink-0" />
										<span className="truncate">{metric.label}</span>
									</span>
									<span className={`${valueColor} flex-shrink-0 whitespace-nowrap font-medium`}>
										{formattedValue}
									</span>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</button>
	);
});
