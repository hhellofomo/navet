import * as Dialog from '@radix-ui/react-dialog';
import { memo } from 'react';
import { BRIGHTNESS_PRESETS, PRESET_COLORS, TEMP_OPTIONS } from '../../constants/light-constants';
import { IconPicker } from '../icon-picker';
import { BrightnessPresets } from '../shared/brightness-presets';
import { ColorSelectorSection } from '../shared/color-selector-section';
import { ColorTemperatureSection } from '../shared/color-temperature-section';
import { CustomScrollbar } from '../shared/custom-scrollbar';
import { DialogHeader } from '../shared/dialog-header';

interface LightSettingsDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	name: string;
	room: string;
	isOn: boolean;
	colorTemp: number;
	selectedColor: string | null;
	customColor: string;
	brightness: number;
	selectedIcon: string;
	onTempChange: (temp: number) => void;
	onColorChange: (color: string) => void;
	onCustomColorChange: (color: string) => void;
	onBrightnessChange: (brightness: number) => void;
	onIconChange: (icon: string) => void;
}

export const LightSettingsDialog = memo(function LightSettingsDialog({
	isOpen,
	onOpenChange,
	name,
	room,
	isOn,
	colorTemp,
	selectedColor,
	customColor,
	brightness,
	selectedIcon,
	onTempChange,
	onColorChange,
	onCustomColorChange,
	onBrightnessChange,
	onIconChange,
}: LightSettingsDialogProps) {
	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
				<Dialog.Content
					className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md h-[85vh] backdrop-blur-xl rounded-3xl border shadow-2xl z-50 animate-in fade-in zoom-in duration-200 overflow-hidden ${
						isOn
							? 'bg-gradient-to-br from-orange-900/95 to-orange-950/95 border-orange-500/20'
							: 'bg-gradient-to-br from-gray-900/95 to-gray-950/95 border-gray-500/10'
					}`}
				>
					<CustomScrollbar isOn={isOn}>
						<div className="p-8">
							<DialogHeader title="Light Settings" description={`${name} - ${room}`} isOn={isOn} />

							<div className="space-y-8">
								<ColorTemperatureSection
									colorTemp={colorTemp}
									isOn={isOn}
									tempOptions={Array.from(TEMP_OPTIONS)}
									onTempChange={onTempChange}
								/>

								<ColorSelectorSection
									colors={Array.from(PRESET_COLORS)}
									selectedColor={selectedColor}
									customColor={customColor}
									isOn={isOn}
									onColorChange={onColorChange}
									onCustomColorChange={onCustomColorChange}
								/>

								<BrightnessPresets
									presets={Array.from(BRIGHTNESS_PRESETS)}
									currentBrightness={brightness}
									isOn={isOn}
									onBrightnessChange={onBrightnessChange}
								/>

								<IconPicker
									selectedIcon={selectedIcon}
									onIconChange={onIconChange}
									isLightOn={isOn}
								/>
							</div>
						</div>
					</CustomScrollbar>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
});
