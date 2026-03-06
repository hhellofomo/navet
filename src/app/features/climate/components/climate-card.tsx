import { Thermometer } from 'lucide-react';
import { memo, useState } from 'react';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { useTheme } from '@/app/contexts/theme-context';
import { ClimateLargeView } from './climate/climate-large-view';
import { ClimateMediumView } from './climate/climate-medium-view';
import { ClimateSmallView } from './climate/climate-small-view';
import { useClimateTheme } from './climate/use-climate-theme';

interface ClimateCardProps {
	id: string;
	name: string;
	temperature: number;
	mode: string;
	size: CardSize;
	onSizeChange: (id: string, size: CardSize) => void;
	isEditMode: boolean;
}

export const ClimateCard = memo(function ClimateCard({
	id,
	name,
	temperature,
	mode: initialMode,
	size,
	onSizeChange,
	isEditMode,
}: ClimateCardProps) {
	const [mode, setMode] = useState(initialMode);
	const { theme } = useTheme();
	const {
		cardGradient,
		cardBorder,
		textPrimary,
		textSecondary,
		iconBg,
		iconColor,
		glowGradient,
		activeBtnBg,
		inactiveBtnBg,
	} = useClimateTheme(theme);

	// Size-specific styling with intelligent layout adaptation
	const isSmall = size === 'small';
	const isMedium = size === 'medium';
	const _isLarge = size === 'large';
	const padding = isSmall ? 'p-4' : 'p-5';
	const isOff = mode === 'off';
	const resolvedIconBg = theme === 'light' && isOff ? 'bg-gray-300/70' : iconBg;
	const resolvedIconColor = theme === 'light' && isOff ? 'text-gray-600' : iconColor;
	const resolvedTextSecondary = theme === 'light' && isOff ? 'text-gray-600' : textSecondary;

	return (
		<div
			className={`relative h-full bg-gradient-to-br ${cardGradient} backdrop-blur-xl rounded-3xl ${padding} border ${cardBorder} overflow-hidden ${theme === 'light' ? 'shadow-lg' : ''}`}
		>
			{isEditMode && (
				<CardSizeSelector
					currentSize={size}
					onSizeChange={(newSize) => onSizeChange(id, newSize)}
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
							{name}
						</h3>
						<p className="text-[10px] text-gray-400 truncate mt-0.5">Climate</p>
					</div>
					<div
						className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${resolvedIconBg} flex items-center justify-center flex-shrink-0`}
					>
						<Thermometer className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} ${resolvedIconColor}`} />
					</div>
				</div>

				{isSmall ? (
					<ClimateSmallView
						temperature={temperature}
						mode={mode}
						textPrimary={textPrimary}
						textSecondary={resolvedTextSecondary}
					/>
				) : isMedium ? (
					<ClimateMediumView
						temperature={temperature}
						mode={mode}
						textPrimary={textPrimary}
						textSecondary={resolvedTextSecondary}
						activeBtnBg={activeBtnBg}
						inactiveBtnBg={inactiveBtnBg}
						onModeChange={setMode}
					/>
				) : (
					<ClimateLargeView
						temperature={temperature}
						mode={mode}
						textPrimary={textPrimary}
						textSecondary={resolvedTextSecondary}
						activeBtnBg={activeBtnBg}
						inactiveBtnBg={inactiveBtnBg}
						onModeChange={setMode}
					/>
				)}
			</div>
		</div>
	);
});
