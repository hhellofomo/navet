import { Home, MapPin, User } from 'lucide-react';
import { memo } from 'react';
import { useTheme } from '../contexts/theme-context';
import { type CardSize, CardSizeSelector } from './card-size-selector';

interface PersonCardProps {
	name: string;
	location: string;
	state: 'home' | 'away';
	size: CardSize;
	onSizeChange: (id: string, size: CardSize) => void;
	isEditMode: boolean;
}

export const PersonCard = memo(function PersonCard({
	name,
	location,
	state,
	size,
	onSizeChange,
	isEditMode,
}: PersonCardProps) {
	const cardId = `person-${name.toLowerCase().replace(/ /g, '-')}`;
	const { theme, colors } = useTheme();

	// Size-specific styling
	const isSmall = size === 'small';
	const padding = isSmall ? 'p-4' : 'p-5';

	const cardColors = state === 'home' ? colors.person.home : colors.person.away;
	const textColor =
		theme === 'light'
			? state === 'home'
				? 'text-gray-900'
				: 'text-gray-500'
			: state === 'home'
				? 'text-white'
				: 'text-gray-500';
	const subTextColor =
		theme === 'light'
			? state === 'home'
				? 'text-gray-600'
				: 'text-gray-400'
			: state === 'home'
				? 'text-gray-400'
				: 'text-gray-600';
	const avatarAwayBg = theme === 'light' ? 'bg-gray-200' : 'bg-gray-700/30';
	const statusPillBg = theme === 'light' ? 'bg-gray-100' : 'bg-white/5';
	const homeIconColor = theme === 'light' ? 'text-emerald-600' : 'text-emerald-400';
	const statusLabelColor =
		theme === 'light'
			? state === 'home'
				? 'text-gray-700'
				: 'text-gray-500'
			: state === 'home'
				? 'text-gray-400'
				: 'text-gray-400';
	const awayIconColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400';

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
				<div className="flex items-start justify-between mb-2">
					<div className="min-w-0 flex-1">
						<h3
							className={`font-semibold truncate ${isSmall ? 'text-xs' : 'text-sm'} ${textColor}`}
						>
							{name}
						</h3>
						{!isSmall && <p className={`text-xs ${subTextColor}`}>{location}</p>}
					</div>
				</div>

				<div className="flex-1 flex flex-col items-center justify-center">
					<div
						className={`${isSmall ? 'w-10 h-10' : 'w-14 h-14'} rounded-full flex items-center justify-center mb-2 ${
							state === 'home'
								? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/50'
								: avatarAwayBg
						}`}
					>
						<User
							className={`${isSmall ? 'w-5 h-5' : 'w-7 h-7'} ${state === 'home' ? 'text-white' : 'text-gray-600'}`}
						/>
					</div>

					{!isSmall && (
						<div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusPillBg}`}>
							{state === 'home' ? (
								<>
									<Home className={`w-3 h-3 ${homeIconColor}`} />
									<span className={`text-xs ${statusLabelColor} font-medium`}>Home</span>
								</>
							) : (
								<>
									<MapPin className={`w-3 h-3 ${awayIconColor}`} />
									<span className={`text-xs ${statusLabelColor}`}>Away</span>
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
});
