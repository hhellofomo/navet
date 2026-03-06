import * as Slider from '@radix-ui/react-slider';
import { memo } from 'react';

interface ColorTemperature {
	value: number;
	color: string;
	label: string;
}

interface ColorTemperatureSectionProps {
	colorTemp: number;
	isOn: boolean;
	tempOptions: ColorTemperature[];
	onTempChange: (temp: number) => void;
}

export const ColorTemperatureSection = memo(function ColorTemperatureSection({
	colorTemp,
	isOn,
	tempOptions,
	onTempChange,
}: ColorTemperatureSectionProps) {
	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<span
					className={`text-sm font-medium transition-colors duration-500 ${isOn ? 'text-gray-300' : 'text-gray-500'}`}
				>
					Color Temperature
				</span>
				<span
					className={`text-sm font-semibold transition-colors duration-500 ${isOn ? 'text-white' : 'text-gray-500'}`}
				>
					{colorTemp}K
				</span>
			</div>

			{/* Temperature Slider */}
			<div className="mb-4">
				<Slider.Root
					value={[colorTemp]}
					onValueChange={(value) => onTempChange(value[0])}
					min={2700}
					max={6500}
					step={100}
					disabled={!isOn}
					className="relative flex items-center w-full h-5"
				>
					<Slider.Track
						className={`relative grow rounded-full h-2 transition-colors duration-500 ${
							isOn ? 'bg-gradient-to-r from-[#FFB366] via-[#FFF4E6] to-[#E6F2FF]' : 'bg-gray-700/20'
						}`}
					>
						<Slider.Range
							className="absolute rounded-full h-full"
							style={{ background: 'transparent' }}
						/>
					</Slider.Track>
					<Slider.Thumb
						className={`block w-5 h-5 rounded-full shadow-lg focus:outline-none focus:ring-2 transition-all duration-500 border-2 ${
							isOn
								? 'bg-white border-white focus:ring-orange-500/50 cursor-pointer'
								: 'bg-gray-600 border-gray-600 focus:ring-gray-500/50 cursor-not-allowed'
						}`}
					/>
				</Slider.Root>
			</div>

			{/* Temperature Presets */}
			<div className="grid grid-cols-5 gap-2">
				{tempOptions.map((temp) => (
					<button
						type="button"
						key={temp.value}
						onClick={() => onTempChange(temp.value)}
						disabled={!isOn}
						className={`h-10 rounded-full text-xs font-semibold transition-all duration-300 border-2 ${
							colorTemp === temp.value
								? 'border-white scale-105 shadow-lg'
								: isOn
									? 'border-transparent hover:border-white/30'
									: 'border-transparent cursor-not-allowed opacity-50'
						}`}
						style={{
							backgroundColor: isOn ? temp.color : '#4a4a4a',
						}}
					>
						{temp.label}
					</button>
				))}
			</div>
		</div>
	);
});
