import { memo } from 'react';

interface CustomColorTriggerProps {
	isOn: boolean;
	currentColor: string;
	onColorChange: (color: string) => void;
	size: 'small' | 'medium' | 'large';
}

export const CustomColorTrigger = memo(function CustomColorTrigger({
	isOn,
	currentColor,
	onColorChange,
	size,
}: CustomColorTriggerProps) {
	const inputColor =
		typeof currentColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(currentColor)
			? currentColor
			: '#ffa500';
	const triggerSize = size === 'small' ? 'w-7 h-7' : size === 'medium' ? 'w-8 h-8' : 'w-12 h-12';
	const innerSize = size === 'small' ? 'w-3.5 h-3.5' : size === 'medium' ? 'w-4 h-4' : 'w-6 h-6';
	const dotSize = size === 'small' ? 'w-1.5 h-1.5' : size === 'medium' ? 'w-2 h-2' : 'w-3 h-3';

	return (
		<label
			className={`${triggerSize} rounded-full hover:scale-105 transition-all flex items-center justify-center cursor-pointer relative overflow-hidden`}
			title="Custom color"
			aria-label="Choose custom color"
			onClick={(e) => e.stopPropagation()}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					(e.currentTarget.querySelector('input[type="color"]') as HTMLInputElement)?.click();
				}
			}}
			tabIndex={isOn ? 0 : -1}
			style={{
				background: `linear-gradient(135deg, ${inputColor} 0%, ${inputColor}cc 45%, rgba(255, 255, 255, 0.9) 100%)`,
			}}
		>
			<input
				type="color"
				value={inputColor}
				aria-label="Choose custom color"
				onChange={(e) => {
					e.stopPropagation();
					onColorChange(e.target.value);
				}}
				disabled={!isOn}
				className="absolute inset-0 opacity-0 cursor-pointer"
			/>
			<div
				className={`${innerSize} rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center pointer-events-none`}
			>
				<div
					className={`${dotSize} rounded-full border border-white/80`}
					style={{
						background: `linear-gradient(135deg, ${inputColor} 0%, rgba(255, 255, 255, 0.9) 100%)`,
					}}
				/>
			</div>
		</label>
	);
});
