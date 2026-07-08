import { Wifi } from 'lucide-react';
import { memo } from 'react';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { useTheme } from '@/app/contexts/theme-context';

interface WifiCardProps {
	networkName: string;
	speed: number;
	uploadSpeed: string;
	downloadSpeed: string;
	size: CardSize;
	onSizeChange: (id: string, size: CardSize) => void;
	isEditMode: boolean;
}

export const WifiCard = memo(function WifiCard({
	networkName,
	speed,
	uploadSpeed,
	downloadSpeed,
	size,
	onSizeChange,
	isEditMode,
}: WifiCardProps) {
	const cardId = 'wifi-1';
	const { theme } = useTheme();

	// Size-specific styling with intelligent layout adaptation
	const isSmall = size === 'small';
	const isMedium = size === 'medium';
	const _isLarge = size === 'large';
	const padding = isSmall ? 'p-4' : 'p-5';

	// Theme-aware colors
	const cardGradient =
		theme === 'light' ? 'from-white to-green-50/80' : 'from-green-900/90 to-green-950/95';
	const cardBorder = theme === 'light' ? 'border-gray-200/80' : 'border-green-700/30';
	const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
	const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
	const iconBg = theme === 'light' ? 'bg-green-100' : 'bg-green-500/20';
	const iconColor = theme === 'light' ? 'text-green-600' : 'text-green-400';
	const glowGradient = theme === 'light' ? 'from-green-50/40' : 'from-green-500/5';

	return (
		<div
			className={`relative h-full bg-gradient-to-br ${cardGradient} backdrop-blur-xl rounded-3xl ${padding} border ${cardBorder} overflow-hidden ${theme === 'light' ? 'shadow-lg' : ''}`}
		>
			{isEditMode && (
				<CardSizeSelector
					currentSize={size}
					onSizeChange={(newSize) => onSizeChange(cardId, newSize)}
				/>
			)}

			<div className={`absolute inset-0 bg-gradient-to-br ${glowGradient} to-transparent`}></div>

			{/* Light theme frosted overlay */}
			{theme === 'light' && <div className="absolute inset-0 bg-white/60" />}

			<div className="relative h-full flex flex-col">
				<div className={`flex items-start justify-between ${isSmall ? 'mb-1' : 'mb-2'}`}>
					<div className="min-w-0 flex-1">
						<h3
							className={`font-semibold ${textPrimary} truncate ${isSmall ? 'text-xs' : 'text-sm'}`}
						>
							Wi-Fi
						</h3>
						<p className="text-[10px] text-gray-400 truncate mt-0.5">Network</p>
						{!isSmall && <p className={`text-xs ${textSecondary} truncate`}>{networkName}</p>}
					</div>
					<div
						className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}
					>
						<Wifi className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} ${iconColor}`} />
					</div>
				</div>

				{isSmall ? (
					// Small: Just speed
					<div className="flex-1 flex items-center justify-center">
						<div className={`text-2xl font-bold ${textPrimary} leading-none`}>
							{speed}
							<span className="text-xs ml-1">Mbps</span>
						</div>
					</div>
				) : isMedium ? (
					// Medium: Speed with compact stats
					<div className="flex-1 flex flex-col justify-center">
						<div className={`text-3xl font-bold ${textPrimary} mb-1`}>
							{speed} <span className="text-base">Mbps</span>
						</div>
						<div className={`flex gap-3 text-xs ${textSecondary}`}>
							<span>↑ {uploadSpeed} Mbps</span>
							<span>↓ {downloadSpeed}</span>
						</div>
					</div>
				) : (
					// Large: Full display
					<div className="flex-1 flex flex-col justify-center">
						<div className={`text-3xl font-bold ${textPrimary} mb-1`}>{speed} Mbps</div>
						<div className="flex gap-4 text-xs mt-2">
							<div>
								<span className={textSecondary}>↑ {uploadSpeed} Mbps</span>
							</div>
							<div>
								<span className={textSecondary}>↓ {downloadSpeed}</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
});
