import * as Dialog from '@radix-ui/react-dialog';
import { Flame, Power, Snowflake, Wind } from 'lucide-react';
import { memo } from 'react';
import { getHVACModeButtonColor } from '../utils/hvac-styles';
import { CustomScrollbar } from './shared/custom-scrollbar';
import { DialogHeader } from './shared/dialog-header';

interface HVACSettingsDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	name: string;
	room: string;
	isOn: boolean;
	mode: string;
	targetTemp: number;
	currentTemp: number;
	onModeChange: (mode: string) => void;
	onTogglePower: () => void;
}

export const HVACSettingsDialog = memo(function HVACSettingsDialog({
	isOpen,
	onOpenChange,
	name,
	room,
	isOn,
	mode,
	targetTemp,
	currentTemp,
	onModeChange,
	onTogglePower,
}: HVACSettingsDialogProps) {
	const getModeColor = () => {
		if (!isOn) return { from: 'gray-900', to: 'gray-950', border: 'gray-500/10' };
		switch (mode) {
			case 'cool':
				return { from: 'blue-900', to: 'blue-950', border: 'blue-500/20' };
			case 'heat':
				return { from: 'red-900', to: 'red-950', border: 'red-500/20' };
			case 'fan':
				return { from: 'green-900', to: 'green-950', border: 'green-500/20' };
			default:
				return { from: 'gray-900', to: 'gray-950', border: 'gray-500/10' };
		}
	};

	const getModeButtonColorWithShadow = (buttonMode: string) => {
		const baseColor = getHVACModeButtonColor(buttonMode, mode, isOn);
		if (mode === buttonMode && isOn) {
			switch (buttonMode) {
				case 'cool':
					return `${baseColor} shadow-lg shadow-blue-500/30`;
				case 'heat':
					return `${baseColor} shadow-lg shadow-red-500/30`;
				case 'fan':
					return `${baseColor} shadow-lg shadow-green-500/30`;
			}
		}
		return baseColor;
	};

	const colors = getModeColor();

	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
				<Dialog.Content
					className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md h-auto max-h-[85vh] backdrop-blur-xl rounded-3xl border shadow-2xl z-50 animate-in fade-in zoom-in duration-200 overflow-hidden bg-gradient-to-br from-${colors.from}/95 to-${colors.to}/95 border-${colors.border}`}
				>
					<CustomScrollbar isOn={isOn}>
						<div className="p-8">
							<DialogHeader title="HVAC Settings" description={`${name} - ${room}`} isOn={isOn} />

							<div className="space-y-8">
								{/* Temperature Display */}
								<div>
									<div className="text-xs text-gray-400 mb-3">Temperature</div>
									<div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
										<div className="flex items-center justify-between">
											<div>
												<div className="text-xs text-gray-400">Target</div>
												<div
													className={`text-4xl font-bold ${isOn ? 'text-white' : 'text-gray-500'} leading-none mt-1`}
												>
													{targetTemp}°C
												</div>
											</div>
											<div className="text-right">
												<div className="text-xs text-gray-400">Current</div>
												<div className="text-2xl font-bold text-gray-400 leading-none mt-1">
													{currentTemp}°C
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Mode Selection */}
								<div>
									<div className="text-xs text-gray-400 mb-3">Mode</div>
									<div className="grid grid-cols-3 gap-3">
										<button
											type="button"
											onClick={() => onModeChange('cool')}
											disabled={!isOn}
											className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all disabled:opacity-50 ${getModeButtonColorWithShadow('cool')}`}
										>
											<div
												className={`w-12 h-12 rounded-full flex items-center justify-center ${
													mode === 'cool' && isOn ? 'bg-white/20' : 'bg-white/10'
												}`}
											>
												<Snowflake className="w-6 h-6" />
											</div>
											<span className="text-sm font-medium">Cool</span>
										</button>

										<button
											type="button"
											onClick={() => onModeChange('heat')}
											disabled={!isOn}
											className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all disabled:opacity-50 ${getModeButtonColorWithShadow('heat')}`}
										>
											<div
												className={`w-12 h-12 rounded-full flex items-center justify-center ${
													mode === 'heat' && isOn ? 'bg-white/20' : 'bg-white/10'
												}`}
											>
												<Flame className="w-6 h-6" />
											</div>
											<span className="text-sm font-medium">Heat</span>
										</button>

										<button
											type="button"
											onClick={() => onModeChange('fan')}
											disabled={!isOn}
											className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all disabled:opacity-50 ${getModeButtonColorWithShadow('fan')}`}
										>
											<div
												className={`w-12 h-12 rounded-full flex items-center justify-center ${
													mode === 'fan' && isOn ? 'bg-white/20' : 'bg-white/10'
												}`}
											>
												<Wind className="w-6 h-6" />
											</div>
											<span className="text-sm font-medium">Fan</span>
										</button>
									</div>
								</div>

								{/* Power Control */}
								<div>
									<div className="text-xs text-gray-400 mb-3">Power</div>
									<button
										type="button"
										onClick={onTogglePower}
										className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
											isOn ? 'bg-white/10 hover:bg-white/15' : 'bg-red-500/20 hover:bg-red-500/30'
										}`}
									>
										<div className="flex items-center gap-3">
											<div
												className={`w-12 h-12 rounded-full flex items-center justify-center ${
													isOn ? 'bg-white/10' : 'bg-red-500/30'
												}`}
											>
												<Power className="w-6 h-6 text-white" />
											</div>
											<span className="text-sm font-medium text-white">
												{isOn ? 'Turn Off' : 'Turn On'}
											</span>
										</div>
										<div
											className={`px-3 py-1 rounded-full text-xs font-medium ${
												isOn ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
											}`}
										>
											{isOn ? 'ON' : 'OFF'}
										</div>
									</button>
								</div>
							</div>
						</div>
					</CustomScrollbar>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
});
