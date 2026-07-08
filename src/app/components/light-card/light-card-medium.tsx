import type { LucideIcon } from 'lucide-react';
import { Settings, Sun } from 'lucide-react';
import { memo } from 'react';
import { useTheme } from '../../contexts/theme-context';
import { BrightnessSlider } from '../shared/brightness-slider';

interface LightCardMediumProps {
	name: string;
	room: string;
	brightness: number;
	colorTemp: number;
	selectedColor: string | null;
	isOn: boolean;
	IconComponent: LucideIcon;
	onBrightnessChange: (value: number) => void;
	onTempChange: (temp: number) => void;
	onColorChange: (color: string) => void;
	onClearColor: () => void;
	onSettingsClick: () => void;
}

export const LightCardMedium = memo(function LightCardMedium({
	name,
	brightness,
	colorTemp,
	selectedColor,
	isOn,
	IconComponent,
	onBrightnessChange,
	onTempChange,
	onColorChange,
	onClearColor,
	onSettingsClick,
}: Omit<LightCardMediumProps, 'room'>) {
	const { theme } = useTheme();
	const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
	const iconBgColor =
		theme === 'light' ? (isOn ? 'bg-amber-400/50' : 'bg-gray-200/60') : 'bg-orange-500/20';
	const iconColor =
		theme === 'light'
			? isOn
				? 'text-amber-600'
				: 'text-gray-400'
			: isOn
				? 'text-orange-400'
				: 'text-gray-500';
	const buttonBg =
		theme === 'light' ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20';
	const buttonText = theme === 'light' ? 'text-gray-900' : 'text-white';

	// Get temperature color based on value
	const getTempColor = () => {
		if (colorTemp <= 3000) return '#FFB27F'; // Warm
		if (colorTemp <= 4500) return '#FFE5B4'; // Neutral
		return '#E6F2FF'; // Cool
	};

	return (
		<>
			{/* Header */}
			<div className="flex items-start justify-between mb-2">
				<div className="min-w-0 flex-1">
					<h3 className={`font-semibold ${textColor} truncate text-sm`}>{name}</h3>
				</div>
				<div
					className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center flex-shrink-0`}
				>
					<IconComponent className={`w-5 h-5 ${iconColor}`} />
				</div>
			</div>

			<div className="flex-1 flex flex-col justify-end gap-2">
				{/* Brightness slider */}
				<BrightnessSlider
					value={brightness}
					onChange={onBrightnessChange}
					size="medium"
					onClick={(e) => e.stopPropagation()}
				/>

				{/* Color controls */}
				<div className="flex gap-2 items-center">
					{/* Temperature color picker */}
					<label
						className="w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer relative overflow-hidden bg-gradient-to-r from-amber-600 via-yellow-200 to-blue-200 hover:scale-105"
						title="Color Temperature"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								(e.currentTarget.querySelector('input[type="color"]') as HTMLInputElement)?.click();
							}
						}}
						tabIndex={isOn ? 0 : -1}
					>
						<input
							type="color"
							value={getTempColor()}
							onChange={(e) => {
								e.stopPropagation();
								// Map color to approximate temperature
								const color = e.target.value;
								// Simple heuristic: warmer colors = lower kelvin
								const r = parseInt(color.slice(1, 3), 16);
								const b = parseInt(color.slice(5, 7), 16);
								let temp = 4000;
								if (r > b + 50)
									temp = 2700; // Warm
								else if (b > r + 50)
									temp = 6500; // Cool
								else temp = 4000; // Neutral
								onTempChange(temp);
								onClearColor();
							}}
							disabled={!isOn}
							className="absolute inset-0 opacity-0 cursor-pointer"
						/>
						<div
							className={`w-4 h-4 rounded-full backdrop-blur-sm flex items-center justify-center pointer-events-none ${
								!selectedColor && isOn ? 'bg-white/30' : 'bg-white/20'
							}`}
						>
							<Sun className="w-2.5 h-2.5 text-white" />
						</div>
					</label>

					{/* Rainbow color picker */}
					<label
						className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 hover:scale-105 transition-all flex items-center justify-center cursor-pointer relative overflow-hidden"
						title="Custom color"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								(e.currentTarget.querySelector('input[type="color"]') as HTMLInputElement)?.click();
							}
						}}
						tabIndex={isOn ? 0 : -1}
					>
						<input
							type="color"
							onChange={(e) => {
								e.stopPropagation();
								onColorChange(e.target.value);
							}}
							disabled={!isOn}
							className="absolute inset-0 opacity-0 cursor-pointer"
						/>
						<div className="w-4 h-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
							<div className="w-2 h-2 rounded-full border-2 border-white" />
						</div>
					</label>

					{/* Spacer */}
					<div className="flex-1" />

					{/* Settings button */}
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onSettingsClick();
						}}
						className={`w-8 h-8 rounded-full ${buttonBg} transition-all flex items-center justify-center`}
					>
						<Settings className={`w-3.5 h-3.5 ${buttonText}`} />
					</button>
				</div>
			</div>
		</>
	);
});
