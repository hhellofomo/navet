import { Calendar, Plug, Power, Zap } from 'lucide-react';
import { memo, useState } from 'react';
import { useTheme } from '../contexts/theme-context';

interface SwitchCardProps {
	name: string;
	room: string;
	initialState?: boolean;
	power?: number; // Current power in watts
	voltage?: number; // Voltage
	energy?: number; // Energy consumption in kWh
}

export const SwitchCard = memo(function SwitchCard({
	name,
	initialState = false,
	power,
	voltage,
	energy,
}: Omit<SwitchCardProps, 'room'>) {
	const [isOn, setIsOn] = useState(initialState);
	const { colors, theme } = useTheme();

	const formatPower = (watts?: number) => {
		if (!watts) return null;
		if (watts >= 1000) return `${(watts / 1000).toFixed(1)} kW`;
		return `${watts} W`;
	};

	const hasMetrics = power !== undefined || voltage !== undefined || energy !== undefined;

	const cardColors = isOn ? colors.switch.on : colors.switch.off;
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

	return (
		<button
			type="button"
			onClick={() => setIsOn(!isOn)}
			className={`relative h-full w-full bg-gradient-to-br ${cardColors.gradient} backdrop-blur-xl rounded-3xl p-4 border ${cardColors.border} overflow-hidden transition-all duration-500 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${theme === 'light' ? 'shadow-lg' : ''}`}
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
					</div>
					<div
						className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${cardColors.iconBg}`}
					>
						<Power className={`w-4 h-4 transition-colors duration-500 ${cardColors.accent}`} />
					</div>
				</div>

				<div className="flex-1"></div>

				{/* Metrics display */}
				{hasMetrics && isOn && (
					<div className="space-y-0.5">
						{power !== undefined && (
							<div className="flex items-center justify-between text-xs">
								<span className={`${labelColor} flex items-center gap-1`}>
									<Zap className="w-3 h-3" />
									Power
								</span>
								<span className={`${valueColor} font-medium`}>{formatPower(power)}</span>
							</div>
						)}
						{voltage !== undefined && (
							<div className="flex items-center justify-between text-xs">
								<span className={`${labelColor} flex items-center gap-1`}>
									<Plug className="w-3 h-3" />
									Voltage
								</span>
								<span className={`${valueColor} font-medium`}>{voltage} V</span>
							</div>
						)}
						{energy !== undefined && (
							<div className="flex items-center justify-between text-xs">
								<span className={`${labelColor} flex items-center gap-1`}>
									<Calendar className="w-3 h-3" />
									Today
								</span>
								<span className={`${valueColor} font-medium`}>{energy.toFixed(2)} kWh</span>
							</div>
						)}
					</div>
				)}
			</div>
		</button>
	);
});
