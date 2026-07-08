import { Check, Edit3, Plus } from 'lucide-react';
import { memo } from 'react';
import { useTheme } from '@/app/contexts/theme-context';

interface RoomNavProps {
	activeRoom: string;
	onRoomChange: (room: string) => void;
	isEditMode: boolean;
	onToggleEditMode: () => void;
	onAddCard?: () => void;
}

export const RoomNav = memo(function RoomNav({
	activeRoom,
	onRoomChange,
	isEditMode,
	onToggleEditMode,
	onAddCard,
}: RoomNavProps) {
	const rooms = ['All', 'Living Room', 'Bathroom', 'Kitchen', 'Dining Room', 'Play Room', 'Office'];
	const { theme } = useTheme();

	const textSecondary =
		theme === 'light' ? 'text-gray-600' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-400';
	const textPrimary =
		theme === 'light' ? 'text-gray-900' : theme === 'contrast' ? 'text-white' : 'text-white';
	const inactiveBg =
		theme === 'light' ? 'bg-gray-100' : theme === 'contrast' ? 'bg-black/50' : 'bg-white/5';
	const hoverBg =
		theme === 'light'
			? 'hover:bg-gray-200'
			: theme === 'contrast'
				? 'hover:bg-white/20'
				: 'hover:bg-white/10';
	const border =
		theme === 'light'
			? 'border-gray-200'
			: theme === 'contrast'
				? 'border-white/20'
				: 'border-white/5';

	return (
		<div
			className={`flex items-center gap-2 pb-4 md:pb-6 border-b ${border} mb-6 md:mb-8 overflow-x-auto scrollbar-hide`}
		>
			{rooms.map((room) => (
				<button
					type="button"
					key={room}
					onClick={() => onRoomChange(room)}
					className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
						activeRoom === room
							? 'bg-orange-500 text-white'
							: `${textSecondary} ${hoverBg} hover:${textPrimary}`
					}`}
				>
					{room}
				</button>
			))}

			{isEditMode && onAddCard && (
				<button
					type="button"
					onClick={onAddCard}
					className="ml-auto p-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors flex-shrink-0 flex items-center gap-2 px-3"
				>
					<Plus className="w-4 h-4 text-white" />
					<span className="text-xs font-medium text-white hidden md:inline">Add Card</span>
				</button>
			)}

			{!isEditMode && <div className="ml-auto" />}

			<button
				type="button"
				onClick={onToggleEditMode}
				className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
					isEditMode ? 'bg-orange-500 hover:bg-orange-600' : `${inactiveBg} ${hoverBg}`
				}`}
			>
				{isEditMode ? (
					<Check className="w-4 h-4 text-white" />
				) : (
					<Edit3 className={`w-4 h-4 ${textSecondary}`} />
				)}
			</button>
		</div>
	);
});
