import type { LucideIcon } from 'lucide-react';
import { Settings } from 'lucide-react';
import { memo } from 'react';
import { BrightnessPresetsInline } from '@/app/components/shared/brightness-presets-inline';
import { BrightnessSlider } from '@/app/components/shared/brightness-slider';
import { useTheme } from '@/app/contexts/theme-context';
import { CustomColorTrigger } from './custom-color-trigger';
import { LightCardHeader } from './light-card-header';

interface LightCardSmallProps {
	name: string;
	room: string;
	brightness: number;
	brightnessPresets: Array<{ brightness: number; icon: LucideIcon; key: string; label: string }>;
	isOn: boolean;
	IconComponent: LucideIcon;
	supportsColorControl: boolean;
	onBrightnessChange: (value: number) => void;
	onBrightnessCommit: (value: number) => void;
	onColorChange: (color: string) => void;
	onSettingsClick: () => void;
}

export const LightCardSmall = memo(function LightCardSmall({
	name,
	brightness,
	brightnessPresets,
	isOn,
	IconComponent,
	supportsColorControl,
	onBrightnessChange,
	onBrightnessCommit,
	onColorChange,
	onSettingsClick,
}: LightCardSmallProps) {
	const { theme } = useTheme();
	const buttonBg =
		theme === 'light' ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20';
	const buttonText = theme === 'light' ? 'text-gray-900' : 'text-white';

	return (
		<>
			<LightCardHeader name={name} isOn={isOn} IconComponent={IconComponent} size="small" />

			<div className="flex-1 flex flex-col justify-end gap-2">
				<BrightnessSlider
					value={brightness}
					onChange={onBrightnessChange}
					onCommit={onBrightnessCommit}
					size="small"
					onClick={(e) => e.stopPropagation()}
				/>

				{/* Color controls */}
				<div className="flex gap-2 items-center">
					<BrightnessPresetsInline
						presets={brightnessPresets}
						currentBrightness={brightness}
						isOn={isOn}
						onBrightnessChange={onBrightnessCommit}
						size="small"
						maxVisible={2}
						overflow="menu"
					/>

					{supportsColorControl && (
						<CustomColorTrigger isOn={isOn} onColorChange={onColorChange} size="small" />
					)}

					{/* Spacer */}
					<div className="flex-1" />

					{/* Settings button */}
					<button
						type="button"
						aria-label={`Open settings for ${name}`}
						onClick={(e) => {
							e.stopPropagation();
							onSettingsClick();
						}}
						className={`w-7 h-7 rounded-full ${buttonBg} transition-all flex items-center justify-center`}
					>
						<Settings className={`w-3 h-3 ${buttonText}`} />
					</button>
				</div>
			</div>
		</>
	);
});
