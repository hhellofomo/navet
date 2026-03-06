import * as Dialog from '@radix-ui/react-dialog';
import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { BrightnessPresetEditor } from '@/app/components/shared/brightness-preset-editor';
import { BrightnessPresets } from '@/app/components/shared/brightness-presets';
import { ColorSelectorSection } from '@/app/components/shared/color-selector-section';
import { ColorTemperatureSection } from '@/app/components/shared/color-temperature-section';
import { CustomScrollbar } from '@/app/components/shared/custom-scrollbar';
import { DialogHeader } from '@/app/components/shared/dialog-header';
import { IconPicker } from '@/app/components/shared/icon-picker';
import { PRESET_COLORS } from '@/app/constants/light-constants';
import { useTheme } from '@/app/contexts/theme-context';
import type { BrightnessPresetKey } from '@/app/stores/light-preset-store';

interface LightSettingsDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	name: string;
	room: string;
	isOn: boolean;
	supportsColorTemperature: boolean;
	supportsColorControl: boolean;
	minColorTemp: number;
	maxColorTemp: number;
	tempOptions: Array<{ value: number; color: string; label: string }>;
	brightnessPresets: Array<{
		brightness: number;
		icon: LucideIcon;
		key: BrightnessPresetKey;
		label: string;
	}>;
	colorTemp: number;
	selectedColor: string | null;
	customColor: string;
	brightness: number;
	selectedIcon: string;
	onTempChange: (temp: number) => void;
	onTempCommit?: (temp: number) => void;
	onColorChange: (color: string) => void;
	onCustomColorChange: (color: string) => void;
	onBrightnessChange: (brightness: number) => void;
	applyBrightnessPresetsToAll: boolean;
	onApplyBrightnessPresetsToAllChange: (applyToAll: boolean) => void;
	onBrightnessPresetValueChange: (key: BrightnessPresetKey, value: number) => void;
	onBrightnessPresetOrderChange: (keys: BrightnessPresetKey[]) => void;
	onIconChange: (icon: string) => void;
}

export const LightSettingsDialog = memo(function LightSettingsDialog({
	isOpen,
	onOpenChange,
	name,
	room,
	isOn,
	supportsColorTemperature,
	supportsColorControl,
	minColorTemp,
	maxColorTemp,
	tempOptions,
	brightnessPresets,
	colorTemp,
	selectedColor,
	customColor,
	brightness,
	selectedIcon,
	onTempChange,
	onTempCommit,
	onColorChange,
	onCustomColorChange,
	onBrightnessChange,
	applyBrightnessPresetsToAll,
	onApplyBrightnessPresetsToAllChange,
	onBrightnessPresetValueChange,
	onBrightnessPresetOrderChange,
	onIconChange,
}: LightSettingsDialogProps) {
	const { primaryColor } = useTheme();
	const colorMap = {
		orange: { from: 'from-orange-900/95', to: 'to-orange-950/95', border: 'border-orange-500/20' },
		blue: { from: 'from-blue-900/95', to: 'to-blue-950/95', border: 'border-blue-500/20' },
		green: { from: 'from-green-900/95', to: 'to-green-950/95', border: 'border-green-500/20' },
		purple: { from: 'from-purple-900/95', to: 'to-purple-950/95', border: 'border-purple-500/20' },
		pink: { from: 'from-pink-900/95', to: 'to-pink-950/95', border: 'border-pink-500/20' },
		red: { from: 'from-red-900/95', to: 'to-red-950/95', border: 'border-red-500/20' },
		yellow: { from: 'from-yellow-900/95', to: 'to-yellow-950/95', border: 'border-yellow-500/20' },
		teal: { from: 'from-teal-900/95', to: 'to-teal-950/95', border: 'border-teal-500/20' },
	} as const;
	const activeDialogColors = colorMap[primaryColor];

	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
				<Dialog.Content
					className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md h-[85vh] backdrop-blur-xl rounded-3xl border shadow-2xl z-50 animate-in fade-in zoom-in duration-200 overflow-hidden ${
						isOn
							? `bg-gradient-to-br ${activeDialogColors.from} ${activeDialogColors.to} ${activeDialogColors.border}`
							: 'bg-gradient-to-br from-gray-900/95 to-gray-950/95 border-gray-500/10'
					}`}
				>
					<CustomScrollbar isOn={isOn}>
						<div className="p-8">
							<DialogHeader title="Light Settings" description={`${name} - ${room}`} isOn={isOn} />

							<div className="space-y-8">
								{supportsColorTemperature && (
									<ColorTemperatureSection
										colorTemp={colorTemp}
										isOn={isOn}
										minTemp={minColorTemp}
										maxTemp={maxColorTemp}
										tempOptions={tempOptions}
										onTempChange={onTempChange}
										onTempCommit={onTempCommit}
									/>
								)}

								{supportsColorControl && (
									<ColorSelectorSection
										colors={Array.from(PRESET_COLORS)}
										selectedColor={selectedColor}
										customColor={customColor}
										isOn={isOn}
										onColorChange={onColorChange}
										onCustomColorChange={onCustomColorChange}
									/>
								)}

								<BrightnessPresets
									presets={brightnessPresets}
									currentBrightness={brightness}
									isOn={isOn}
									onBrightnessChange={onBrightnessChange}
								/>

								<BrightnessPresetEditor
									presets={brightnessPresets}
									isOn={isOn}
									onPresetValueChange={onBrightnessPresetValueChange}
									onPresetOrderChange={onBrightnessPresetOrderChange}
									onlyApplyToThisLight={!applyBrightnessPresetsToAll}
									onOnlyApplyToThisLightChange={(checked) =>
										onApplyBrightnessPresetsToAllChange(!checked)
									}
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
