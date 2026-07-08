import { DoorClosed, DoorOpen, Lock, Unlock } from 'lucide-react';
import { memo, useState } from 'react';
import { useTheme } from '@/app/contexts/theme-context';

interface LockCardProps {
	name: string;
	room: string;
	initialState?: boolean; // true = locked, false = unlocked
}

export const LockCard = memo(function LockCard({
	name,
	initialState = true,
}: Omit<LockCardProps, 'room'>) {
	const [isLocked, setIsLocked] = useState(initialState);
	const { theme, colors } = useTheme();

	const cardColors = isLocked ? colors.lock.locked : colors.lock.unlocked;
	const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';

	return (
		<div
			className={`relative h-full bg-gradient-to-br ${cardColors.gradient} backdrop-blur-xl rounded-3xl p-4 border ${cardColors.border} overflow-hidden transition-all duration-500 ${theme === 'light' ? 'shadow-lg' : ''}`}
		>
			<div
				className={`absolute inset-0 bg-gradient-to-br ${cardColors.glow} to-transparent transition-all duration-500`}
			></div>

			{/* Light theme frosted overlay */}
			{theme === 'light' && <div className="absolute inset-0 bg-white/60" />}

			<div className="relative h-full flex flex-col">
				<div className="flex items-start justify-between mb-2">
					<div className="min-w-0 flex-1">
						<h3 className={`font-semibold truncate text-xs ${textColor}`}>{name}</h3>
					</div>
					<div
						className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${cardColors.iconBg}`}
					>
						{isLocked ? (
							<DoorClosed
								className={`w-4 h-4 transition-colors duration-500 ${cardColors.accent}`}
							/>
						) : (
							<DoorOpen className={`w-4 h-4 transition-colors duration-500 ${cardColors.accent}`} />
						)}
					</div>
				</div>

				<div className="flex-1 flex flex-col items-center justify-center">
					<button
						type="button"
						onClick={() => setIsLocked(!isLocked)}
						className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-105 ${
							isLocked
								? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/50'
								: 'bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/50'
						}`}
					>
						{isLocked ? (
							<Lock className="w-6 h-6 text-white" />
						) : (
							<Unlock className="w-6 h-6 text-white" />
						)}
					</button>

					<div className="text-center mt-3">
						<div
							className={`text-xs ${isLocked ? (theme === 'light' ? 'text-green-700' : 'text-green-400') : theme === 'light' ? 'text-red-700' : 'text-red-400'} transition-colors duration-500`}
						>
							{isLocked ? 'Locked' : 'Unlocked'}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
