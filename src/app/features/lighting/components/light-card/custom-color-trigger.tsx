import { memo } from 'react';

interface CustomColorTriggerProps {
	isOn: boolean;
	onColorChange: (color: string) => void;
	size: 'small' | 'medium' | 'large';
}

export const CustomColorTrigger = memo(function CustomColorTrigger({
	isOn,
	onColorChange,
	size,
}: CustomColorTriggerProps) {
	const triggerSize = size === 'small' ? 'w-7 h-7' : size === 'medium' ? 'w-8 h-8' : 'w-12 h-12';
	const innerSize = size === 'small' ? 'w-3.5 h-3.5' : size === 'medium' ? 'w-4 h-4' : 'w-6 h-6';
	const dotSize = size === 'small' ? 'w-1.5 h-1.5' : size === 'medium' ? 'w-2 h-2' : 'w-3 h-3';

	return (
		<label
			className={`${triggerSize} rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 hover:scale-105 transition-all flex items-center justify-center cursor-pointer relative overflow-hidden`}
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
		>
			<input
				type="color"
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
				<div className={`${dotSize} rounded-full border-2 border-white`} />
			</div>
		</label>
	);
});
