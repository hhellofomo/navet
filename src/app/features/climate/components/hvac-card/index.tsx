import { Settings, Wind } from 'lucide-react';
import { memo, useState } from 'react';
import { useTheme } from '../../contexts/theme-context';
import { type CardSize, CardSizeSelector } from '../card-size-selector';
import { HVACSettingsDialog } from '../hvac-settings-dialog';
import { CardWrapper } from '../ui/card-wrapper';
import { HVACGauge } from './hvac-gauge';
import { HVACModeControls } from './hvac-mode-controls';
import { HVACTempControls } from './hvac-temp-controls';

interface HVACCardProps {
	id: string;
	name: string;
	room: string;
	initialTemp?: number;
	initialCurrentTemp?: number;
	initialMode?: string;
	initialState?: boolean;
	size: CardSize;
	onSizeChange: (id: string, size: CardSize) => void;
	isEditMode: boolean;
}

export const HVACCard = memo(function HVACCard({
	id,
	name,
	room,
	initialTemp = 21,
	initialCurrentTemp = 22,
	initialMode = 'cool',
	initialState = true,
	size,
	onSizeChange,
	isEditMode,
}: HVACCardProps) {
	const [targetTemp, setTargetTemp] = useState(initialTemp);
	const [currentTemp] = useState(initialCurrentTemp);
	const [mode, setMode] = useState(initialMode);
	const [isOn, setIsOn] = useState(initialState);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const { colors, theme } = useTheme();

	// Size-specific styling
	const isSmall = size === 'small';
	const isMedium = size === 'medium';
	const _isLarge = size === 'large';

	// Get theme-aware colors based on mode
	const getCardColors = () => {
		if (!isOn) return colors.hvac.off;
		switch (mode) {
			case 'cool':
				return colors.hvac.cooling;
			case 'heat':
				return colors.hvac.heating;
			default:
				return colors.hvac.off;
		}
	};

	const cardColors = getCardColors();
	const textColor =
		theme === 'light'
			? isOn
				? 'text-gray-900'
				: 'text-gray-500'
			: isOn
				? 'text-white'
				: 'text-gray-400';
	const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
	const buttonBg =
		theme === 'light' ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20';
	const buttonText = theme === 'light' ? 'text-gray-900' : 'text-white';

	// Light theme overlay - tinted when active, neutral when off
	const lightOverlay =
		theme === 'light'
			? isOn
				? mode === 'cool'
					? 'bg-cyan-50/45'
					: mode === 'heat'
						? 'bg-orange-50/45'
						: 'bg-white/60'
				: 'bg-white/60'
			: undefined;

	return (
		<>
			<CardWrapper
				onClick={() => setIsOn(!isOn)}
				className={`bg-gradient-to-br ${cardColors.gradient} border ${cardColors.border} p-4 ${!isOn ? 'grayscale opacity-40' : ''}`}
				lightOverlayClassName={lightOverlay}
				showShadow={isOn}
			>
				{isEditMode && (
					<CardSizeSelector
						currentSize={size}
						onSizeChange={(newSize) => onSizeChange(id, newSize)}
					/>
				)}

				<div
					className={`absolute inset-0 bg-gradient-to-br ${cardColors.glow} to-transparent transition-all duration-500`}
				></div>

				<div className="relative z-[2] h-full flex flex-col">
					{/* Header */}
					<div className={`flex items-start justify-between ${isSmall ? 'mb-1' : 'mb-2'}`}>
						<div className="min-w-0 flex-1">
							<h3
								className={`font-semibold ${textColor} truncate ${isSmall ? 'text-xs' : 'text-sm'} transition-colors duration-500`}
							>
								{name}
							</h3>
						</div>
						<div
							className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${cardColors.iconBg} flex items-center justify-center flex-shrink-0 transition-all duration-500`}
						>
							<Wind
								className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} ${cardColors.accent} transition-colors duration-500`}
							/>
						</div>
					</div>

					{/* Content area - adaptive based on size */}
					{isSmall ? (
						// Small: Compact layout
						<div className="flex-1 flex flex-col justify-end gap-2">
							{/* Target temp display (prominent) */}
							<div>
								<div
									className={`text-3xl font-bold ${textColor} leading-none transition-colors duration-500 mb-1`}
								>
									{targetTemp}°C
								</div>
								<div className={`text-xs ${secondaryTextColor}`}>
									Current temperature {currentTemp}°C
								</div>
							</div>

							{/* Controls - following light card standard */}
							<div className="flex gap-2 items-center">
								<HVACTempControls
									targetTemp={targetTemp}
									onTempChange={setTargetTemp}
									isOn={isOn}
									size="small"
								/>

								{/* Spacer */}
								<div className="flex-1" />

								{/* Settings button */}
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										setIsSettingsOpen(true);
									}}
									className={`w-7 h-7 rounded-full ${buttonBg} hover:scale-105 transition-all flex items-center justify-center ${!isOn ? 'opacity-50' : ''}`}
								>
									<Settings className={`w-3 h-3 ${buttonText}`} />
								</button>
							</div>
						</div>
					) : isMedium ? (
						// Medium: More space for controls
						<div className="flex-1 flex flex-col justify-between">
							{/* Target temperature (prominent) */}
							<div>
								<div
									className={`text-3xl font-bold ${textColor} leading-none transition-colors duration-500 mb-1`}
								>
									{targetTemp}°C
								</div>
								<div className={`text-xs ${secondaryTextColor}`}>
									Current temperature {currentTemp}°C
								</div>
							</div>

							{/* Control buttons */}
							<div className="flex gap-2 items-center">
								<HVACTempControls
									targetTemp={targetTemp}
									onTempChange={setTargetTemp}
									isOn={isOn}
									size="medium"
								/>

								<HVACModeControls mode={mode} isOn={isOn} onModeChange={setMode} size="medium" />
							</div>
						</div>
					) : (
						// Large: Full featured layout with half gauge
						<div className="flex-1 flex flex-col justify-between">
							{/* Half Temperature Gauge with side buttons */}
							<div className="flex-1 flex items-center justify-center">
								<div className="relative flex items-end gap-4">
									{/* Temp controls on sides */}
									<div className="mb-8">
										<HVACTempControls
											targetTemp={targetTemp}
											onTempChange={setTargetTemp}
											isOn={isOn}
											size="large"
										/>
									</div>

									{/* Half Gauge */}
									<HVACGauge
										id={id}
										mode={mode}
										targetTemp={targetTemp}
										currentTemp={currentTemp}
										isOn={isOn}
									/>

									{/* Spacer for symmetry */}
									<div className="w-12 h-12 mb-8" />
								</div>
							</div>

							{/* Mode controls - single row */}
							<div className="space-y-2">
								<div className={`text-xs ${secondaryTextColor} text-center`}>Mode</div>
								<div className="flex gap-2 items-center justify-center">
									<HVACModeControls mode={mode} isOn={isOn} onModeChange={setMode} size="large" />
								</div>
							</div>
						</div>
					)}
				</div>
			</CardWrapper>

			<HVACSettingsDialog
				isOpen={isSettingsOpen}
				onOpenChange={setIsSettingsOpen}
				name={name}
				room={room}
				isOn={isOn}
				mode={mode}
				targetTemp={targetTemp}
				currentTemp={currentTemp}
				onModeChange={setMode}
				onTogglePower={() => setIsOn(!isOn)}
			/>
		</>
	);
});
