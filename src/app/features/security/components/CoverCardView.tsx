import * as Dialog from '@radix-ui/react-dialog';
import * as Slider from '@radix-ui/react-slider';
import { ChevronDown, ChevronUp, Settings, Square } from 'lucide-react';
import type { CardSize } from '../../../components/shared/card-size-selector';
import { CardSizeSelector } from '../../../components/shared/card-size-selector';
import type { ThemeType } from '../../../contexts/theme-context';

type DeviceClass =
	| 'blind'
	| 'shade'
	| 'curtain'
	| 'garage'
	| 'gate'
	| 'awning'
	| 'shutter'
	| 'door';

interface DeviceClassConfig {
	label: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface CoverCardViewProps {
	name: string;
	room: string;
	position: number;
	deviceClass: DeviceClass;
	deviceClassConfig: Record<DeviceClass, DeviceClassConfig>;
	size: CardSize;
	isEditMode: boolean;
	cardId: string;
	cardColors: {
		gradient: string;
		border: string;
		iconBg: string;
		accent: string;
		glow: string;
	};
	theme: ThemeType;
	stateDisplay: { text: string; color: string };
	isSettingsOpen: boolean;
	setIsSettingsOpen: (open: boolean) => void;
	onSizeChange: (id: string, size: CardSize) => void;
	handlePositionChange: (newPosition: number) => void;
	handleOpen: () => void;
	handleClose: () => void;
	handleStop: () => void;
	setDeviceClass: (deviceClass: DeviceClass) => void;
}

export function CoverCardView({
	name,
	room,
	position,
	deviceClass,
	deviceClassConfig,
	size,
	isEditMode,
	cardId,
	cardColors,
	theme,
	stateDisplay,
	isSettingsOpen,
	setIsSettingsOpen,
	onSizeChange,
	handlePositionChange,
	handleOpen,
	handleClose,
	handleStop,
	setDeviceClass,
}: CoverCardViewProps) {
	// Size-specific styling with intelligent layout adaptation
	const isSmall = size === 'small';
	const isMedium = size === 'medium';
	const padding = isSmall ? 'p-4' : 'p-5';

	const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
	const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
	const buttonBg =
		theme === 'light' ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20';
	const buttonText = theme === 'light' ? 'text-gray-900' : 'text-white';
	const sliderTrackBg = theme === 'light' ? 'bg-gray-200' : 'bg-white/10';
	const actionBtnClass =
		theme === 'light'
			? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
			: 'bg-white/5 hover:bg-white/10 text-white';
	const settingsBtnClass =
		theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/20';

	const DeviceIcon = deviceClassConfig[deviceClass].icon;

	return (
		<div
			className={`relative h-full bg-gradient-to-br ${cardColors.gradient} backdrop-blur-xl rounded-3xl ${padding} border ${cardColors.border} overflow-hidden ${theme === 'light' ? 'shadow-lg' : ''}`}
		>
			{isEditMode && (
				<CardSizeSelector
					currentSize={size}
					onSizeChange={(newSize) => onSizeChange(cardId, newSize)}
				/>
			)}
			<div className={`absolute inset-0 bg-gradient-to-br ${cardColors.glow} to-transparent`}></div>

			{/* Light theme frosted overlay */}
			{theme === 'light' && <div className="absolute inset-0 bg-white/60" />}
			<div className="relative h-full flex flex-col">
				<div className={`flex items-start justify-between ${isSmall ? 'mb-1' : 'mb-2'}`}>
					<div className="min-w-0 flex-1">
						<h3
							className={`font-semibold ${textColor} truncate ${isSmall ? 'text-xs' : 'text-sm'}`}
						>
							{name}
						</h3>
						{!isSmall && (
							<div className="space-y-0.5">
								<p className={`text-xs ${secondaryTextColor} truncate`}>{room}</p>
								<p className={`text-xs ${stateDisplay.color} truncate`}>{stateDisplay.text}</p>
							</div>
						)}
					</div>
					<div
						className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${cardColors.iconBg} flex items-center justify-center flex-shrink-0`}
					>
						<DeviceIcon className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} ${cardColors.accent}`} />
					</div>
				</div>

				{isSmall ? (
					// Small: Just the percentage and state with quick actions
					<div className="flex-1 flex flex-col justify-end gap-2">
						<div className="flex flex-col">
							<div className={`text-3xl font-bold ${textColor} leading-none mb-1`}>{position}%</div>
							<div className={`text-xs ${stateDisplay.color}`}>{stateDisplay.text}</div>
						</div>

						{/* Quick action buttons + Settings */}
						<div className="flex gap-2 items-center">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleOpen();
								}}
								className={`w-7 h-7 rounded-full ${buttonBg} hover:scale-105 transition-all flex items-center justify-center`}
								title="Open"
							>
								<ChevronUp className={`w-3 h-3 ${buttonText}`} />
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleStop();
								}}
								className={`w-7 h-7 rounded-full ${buttonBg} hover:scale-105 transition-all flex items-center justify-center`}
								title="Stop"
							>
								<Square className={`w-3 h-3 ${buttonText}`} />
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleClose();
								}}
								className={`w-7 h-7 rounded-full ${buttonBg} hover:scale-105 transition-all flex items-center justify-center`}
								title="Close"
							>
								<ChevronDown className={`w-3 h-3 ${buttonText}`} />
							</button>

							{/* Settings button */}
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									setIsSettingsOpen(true);
								}}
								className={`w-7 h-7 rounded-full ${settingsBtnClass} transition-all flex items-center justify-center`}
							>
								<Settings className={`w-3 h-3 ${buttonText}`} />
							</button>
						</div>
					</div>
				) : isMedium ? (
					// Medium: Percentage with compact slider and controls
					<>
						<div className="flex-1 flex flex-col justify-center gap-2">
							<div className={`text-3xl font-bold ${textColor} leading-none mb-1`}>{position}%</div>
							<Slider.Root
								value={[position]}
								onValueChange={(value) => handlePositionChange(value[0])}
								max={100}
								step={1}
								className="relative flex items-center w-full h-5"
							>
								<Slider.Track className={`relative grow rounded-full h-1 ${sliderTrackBg}`}>
									<Slider.Range className="absolute rounded-full h-full bg-gradient-to-r from-indigo-400 to-indigo-600" />
								</Slider.Track>
								<Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer" />
							</Slider.Root>
						</div>
						<div className="flex gap-2 mt-2 items-center">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleOpen();
								}}
								className={`flex-1 py-1.5 ${actionBtnClass} rounded-lg text-[10px] font-medium transition-colors flex items-center justify-center gap-0.5`}
							>
								<ChevronUp className="w-3 h-3" /> Open
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleStop();
								}}
								className={`flex-1 py-1.5 ${actionBtnClass} rounded-lg text-[10px] font-medium transition-colors flex items-center justify-center gap-0.5`}
							>
								<Square className="w-3 h-3" /> Stop
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleClose();
								}}
								className={`flex-1 py-1.5 ${actionBtnClass} rounded-lg text-[10px] font-medium transition-colors flex items-center justify-center gap-0.5`}
							>
								<ChevronDown className="w-3 h-3" /> Close
							</button>

							{/* Spacer */}
							<div className="flex-1" />

							{/* Settings button */}
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									setIsSettingsOpen(true);
								}}
								className={`w-7 h-7 rounded-full ${settingsBtnClass} transition-all flex items-center justify-center`}
							>
								<Settings className={`w-3 h-3 ${buttonText}`} />
							</button>
						</div>
					</>
				) : (
					// Large: Full layout with spacious controls
					<>
						<div className="flex-1 flex flex-col justify-center">
							<div className={`text-3xl font-bold ${textColor} mb-1`}>{position}%</div>
							<Slider.Root
								value={[position]}
								onValueChange={(value) => handlePositionChange(value[0])}
								max={100}
								step={1}
								className="relative flex items-center w-full h-5 mb-3"
							>
								<Slider.Track className={`relative grow rounded-full h-1 ${sliderTrackBg}`}>
									<Slider.Range className="absolute rounded-full h-full bg-gradient-to-r from-indigo-400 to-indigo-600" />
								</Slider.Track>
								<Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer" />
							</Slider.Root>
						</div>
						<div className="flex gap-2 items-center">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleOpen();
								}}
								className={`flex-1 py-2 ${actionBtnClass} rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1`}
							>
								<ChevronUp className="w-3.5 h-3.5" /> Open
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleStop();
								}}
								className={`flex-1 py-2 ${actionBtnClass} rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1`}
							>
								<Square className="w-3.5 h-3.5" /> Stop
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleClose();
								}}
								className={`flex-1 py-2 ${actionBtnClass} rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1`}
							>
								<ChevronDown className="w-3.5 h-3.5" /> Close
							</button>

							{/* Spacer */}
							<div className="flex-1" />

							{/* Settings button */}
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									setIsSettingsOpen(true);
								}}
								className={`w-8 h-8 rounded-full ${settingsBtnClass} transition-all flex items-center justify-center`}
							>
								<Settings className={`w-3.5 h-3.5 ${buttonText}`} />
							</button>
						</div>
					</>
				)}
			</div>

			{/* Device Class Settings Dialog */}
			<Dialog.Root open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
					<Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 w-[90vw] max-w-md z-50 shadow-2xl animate-in fade-in zoom-in duration-200">
						<Dialog.Title className="text-xl font-semibold text-white mb-2">
							Device Type
						</Dialog.Title>
						<Dialog.Description className="text-sm text-gray-400 mb-6">
							Select the type of cover for {name}
						</Dialog.Description>

						<div className="grid grid-cols-2 gap-3 mb-6">
							{(Object.keys(deviceClassConfig) as DeviceClass[]).map((type) => {
								const config = deviceClassConfig[type];
								const Icon = config.icon;
								const isSelected = deviceClass === type;

								return (
									<button
										type="button"
										key={type}
										onClick={() => setDeviceClass(type)}
										className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
											isSelected
												? 'bg-indigo-500/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
												: 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
										}`}
									>
										<div className="flex flex-col items-center gap-2">
											<div
												className={`w-12 h-12 rounded-full flex items-center justify-center ${
													isSelected ? 'bg-indigo-500/30' : 'bg-white/10'
												}`}
											>
												<Icon
													className={`w-6 h-6 ${isSelected ? 'text-indigo-400' : 'text-gray-400'}`}
												/>
											</div>
											<span
												className={`text-xs font-medium text-center ${
													isSelected ? 'text-white' : 'text-gray-400'
												}`}
											>
												{config.label}
											</span>
										</div>
									</button>
								);
							})}
						</div>

						<div className="flex gap-3">
							<Dialog.Close asChild>
								<button
									type="button"
									className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-colors"
								>
									Cancel
								</button>
							</Dialog.Close>
							<Dialog.Close asChild>
								<button
									type="button"
									className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-medium transition-colors"
								>
									Done
								</button>
							</Dialog.Close>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	);
}
