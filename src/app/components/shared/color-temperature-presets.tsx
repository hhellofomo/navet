import { memo } from 'react';

interface ColorTemperature {
	value: number;
	color: string;
	label: string;
}

interface ColorTemperaturePresetsProps {
	options: ColorTemperature[];
	currentTemp: number;
	selectedColor: string | null;
	isOn: boolean;
	onTempChange: (temp: number) => void;
	onClearColor: () => void;
	size?: 'small' | 'medium' | 'large';
}

export const ColorTemperaturePresets = memo(function ColorTemperaturePresets({
	options,
	currentTemp,
	selectedColor,
	isOn,
	onTempChange,
	onClearColor,
	size = 'medium',
}: ColorTemperaturePresetsProps) {
	const buttonSize = size === 'small' ? 'w-8 h-8' : size === 'medium' ? 'w-10 h-10' : 'w-12 h-12';
	const scaleSelected =
		size === 'small' ? 'scale-110' : size === 'medium' ? 'scale-110' : 'scale-[1.15]';
	const glowSize =
		size === 'small'
			? { blur: '12px', spread: '24px', opacity: '80', opacity2: '40' }
			: size === 'medium'
				? { blur: '16px', spread: '32px', opacity: '90', opacity2: '50' }
				: { blur: '20px', spread: '40px', opacity: '95', opacity2: '60' };

	return (
		<>
			{options.map((option) => (
				<button
					type="button"
					key={option.value}
					onClick={(e) => {
						e.stopPropagation();
						onTempChange(option.value);
						onClearColor();
					}}
					disabled={!isOn}
					className={`${buttonSize} rounded-full transition-all duration-500 ${
						currentTemp === option.value && !selectedColor && isOn
							? scaleSelected
							: 'hover:scale-105'
					} ${!isOn ? 'opacity-50 cursor-not-allowed' : ''}`}
					style={{
						backgroundColor: option.color,
						boxShadow:
							currentTemp === option.value && !selectedColor && isOn
								? `0 0 ${glowSize.blur} ${option.color}${glowSize.opacity}, 0 0 ${glowSize.spread} ${option.color}${glowSize.opacity2}`
								: 'none',
					}}
					title={size === 'large' ? `${option.label} (${option.value}K)` : option.label}
				/>
			))}
		</>
	);
});
