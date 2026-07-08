import type { LucideIcon } from 'lucide-react';
import { Settings } from 'lucide-react';
import { memo } from 'react';
import { BrightnessPresetsInline } from '@/app/components/shared/brightness-presets-inline';
import { BrightnessSlider } from '@/app/components/shared/brightness-slider';
import { useTheme } from '@/app/contexts/theme-context';
import { CustomColorTrigger } from './custom-color-trigger';
import { LightCardHeader } from './light-card-header';

interface LightCardMediumProps {
	name: string;
	room: string;
	brightness: number;
	currentColor: string;
	brightnessPresets: Array<{ brightness: number; icon: LucideIcon; key: string; label: string }>;
	isOn: boolean;
	IconComponent: LucideIcon;
	supportsColorControl: boolean;
	onBrightnessChange: (value: number) => void;
	onBrightnessCommit: (value: number) => void;
	onColorChange: (color: string) => void;
	onSettingsClick: () => void;
}

export const LightCardMedium = memo(function LightCardMedium({
	name,
	brightness,
	currentColor,
	brightnessPresets,
	isOn,
	IconComponent,
	supportsColorControl,
	onBrightnessChange,
	onBrightnessCommit,
	onColorChange,
	onSettingsClick,
}: Omit<LightCardMediumProps, 'room'>) {
	const { theme } = useTheme();
	const buttonBg =
		theme === 'light' ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20';
	const buttonText = theme === 'light' ? 'text-gray-900' : 'text-white';

	return (
		<>
			<LightCardHeader name={name} isOn={isOn} IconComponent={IconComponent} size="medium" />

			<div className="flex-1 flex flex-col justify-end gap-4">
				{/* Brightness slider */}
				<BrightnessSlider
					value={brightness}
					onChange={onBrightnessChange}
					onCommit={onBrightnessCommit}
					size="medium"
					onClick={(e) => e.stopPropagation()}
				/>

				{/* Color controls */}
				<div className="flex gap-2 items-center">
					<BrightnessPresetsInline
						presets={brightnessPresets}
						currentBrightness={brightness}
						isOn={isOn}
						onBrightnessChange={onBrightnessCommit}
						size="medium"
						maxVisible={4}
					/>

					{supportsColorControl && (
						<CustomColorTrigger
							isOn={isOn}
							currentColor={currentColor}
							onColorChange={onColorChange}
							size="medium"
						/>
					)}

					{/* Spacer */}
					<div className="flex-1" />

					<button
						type="button"
						aria-label={`Open settings for ${name}`}
						onClick={(e) => {
							e.stopPropagation();
							onSettingsClick();
						}}
						className={`w-8 h-8 shrink-0 self-center rounded-full ${buttonBg} transition-all flex items-center justify-center cursor-pointer`}
					>
						<Settings className={`w-3.5 h-3.5 ${buttonText}`} />
					</button>
				</div>
			</div>
		</>
	);
});
