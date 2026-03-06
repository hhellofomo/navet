import { memo } from 'react';
import { useTheme } from '../contexts/theme-context';
import { type CardSize, CardSizeSelector } from './card-size-selector';
import { useVacuumControl } from './vacuum/use-vacuum-control';
import { VacuumControlsLarge } from './vacuum/vacuum-controls-large';
import { VacuumControlsMedium } from './vacuum/vacuum-controls-medium';
import { VacuumControlsSmall } from './vacuum/vacuum-controls-small';
import { VacuumSettingsDialog } from './vacuum/vacuum-settings-dialog';
import { VacuumStatusDisplay } from './vacuum/vacuum-status-display';

interface VacuumCardProps {
	id: string;
	name: string;
	status: 'cleaning' | 'returning' | 'docked' | 'paused' | 'idle';
	battery: number;
	cleanedArea?: string;
	cleaningTime?: string;
	room?: string;
	size: CardSize;
	onSizeChange: (id: string, size: CardSize) => void;
	isEditMode: boolean;
}

export const VacuumCard = memo(function VacuumCard({
	id,
	name,
	status,
	battery,
	cleanedArea = '0 m²',
	cleaningTime = '0 min',
	room = 'Living Room',
	size,
	onSizeChange,
	isEditMode,
}: VacuumCardProps) {
	const {
		currentStatus,
		isDialogOpen,
		setIsDialogOpen,
		handleStartCleaning,
		handlePause,
		handleReturnHome,
	} = useVacuumControl({ initialStatus: status });
	const { theme, colors } = useTheme();

	// Size-specific styling with intelligent layout adaptation
	const isSmall = size === 'small';
	const isMedium = size === 'medium';
	const _isLarge = size === 'large';
	const padding = isSmall ? 'p-4' : 'p-5';

	const cardGradient =
		theme === 'light' ? 'from-white to-gray-50/80' : 'from-gray-900/90 to-gray-950/95';
	const cardBorder = theme === 'light' ? 'border-gray-200/80' : 'border-gray-700/30';
	const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
	const glowGradient = theme === 'light' ? 'from-gray-50/40' : 'from-gray-500/5';

	return (
		<div className="h-full w-full relative">
			{isEditMode && (
				<CardSizeSelector
					currentSize={size}
					onSizeChange={(newSize) => onSizeChange(id, newSize)}
				/>
			)}

			<div
				className={`relative h-full bg-gradient-to-br ${cardGradient} backdrop-blur-xl rounded-3xl ${padding} border ${cardBorder} overflow-hidden ${theme === 'light' ? 'shadow-lg' : ''}`}
			>
				<div className={`absolute inset-0 bg-gradient-to-br ${glowGradient} to-transparent`}></div>

				{/* Light theme frosted overlay */}
				{theme === 'light' && <div className="absolute inset-0 bg-white/60" />}

				<div className="relative h-full flex flex-col">
					{/* Header */}
					<div className={`flex items-start justify-between ${isSmall ? 'mb-3' : 'mb-4'}`}>
						<div className="min-w-0 flex-1">
							<h3
								className={`font-semibold ${textPrimary} truncate ${isSmall ? 'text-xs' : 'text-sm'}`}
							>
								{name}
							</h3>
						</div>
						<div
							className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${
								colors.vacuum.iconBg
							} flex items-center justify-center flex-shrink-0`}
						>
							<div className={`w-4 h-4 rounded-full ${colors.vacuum.accent}`}></div>
						</div>
					</div>

					{/* Status and Controls */}
					<div className="flex-1 flex flex-col">
						<VacuumStatusDisplay
							currentStatus={currentStatus}
							battery={battery}
							cleanedArea={cleanedArea}
							cleaningTime={cleaningTime}
							room={room}
							theme={theme}
							isSmall={isSmall}
						/>

						<div className="mt-auto pt-4">
							{isSmall ? (
								<VacuumControlsSmall
									currentStatus={currentStatus}
									onStartCleaning={handleStartCleaning}
									onPause={handlePause}
									onReturnHome={handleReturnHome}
									onOpenSettings={() => setIsDialogOpen(true)}
									theme={theme}
								/>
							) : isMedium ? (
								<VacuumControlsMedium
									currentStatus={currentStatus}
									onStartCleaning={handleStartCleaning}
									onPause={handlePause}
									onReturnHome={handleReturnHome}
									onOpenSettings={() => setIsDialogOpen(true)}
									theme={theme}
								/>
							) : (
								<VacuumControlsLarge
									currentStatus={currentStatus}
									onStartCleaning={handleStartCleaning}
									onPause={handlePause}
									onReturnHome={handleReturnHome}
									onOpenSettings={() => setIsDialogOpen(true)}
									theme={theme}
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			<VacuumSettingsDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onStartCleaning={handleStartCleaning}
				onReturnHome={handleReturnHome}
				name={name}
				theme={theme}
			/>
		</div>
	);
});
