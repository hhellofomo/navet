import { Pause, Play } from 'lucide-react';

interface MediaSmallViewProps {
	albumArt: string;
	title: string;
	artist: string;
	isPlaying: boolean;
	isLight: boolean;
	onOpenDialog: () => void;
}

export function MediaSmallView({
	albumArt,
	title,
	artist,
	isPlaying,
	isLight,
	onOpenDialog,
}: MediaSmallViewProps) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onOpenDialog();
		}
	};

	return (
		<button
			type="button"
			className="absolute inset-0 -m-4 group"
			onClick={(e) => {
				e.stopPropagation();
				onOpenDialog();
			}}
			onKeyDown={handleKeyDown}
		>
			<img src={albumArt} alt={`${title} by ${artist}`} className="w-full h-full object-cover" />
			{/* Subtle gradient overlay for depth */}
			<div
				className={`absolute inset-0 ${isLight ? 'bg-gradient-to-b from-white/30 via-transparent to-white/60 opacity-60 group-hover:opacity-40' : 'bg-gradient-to-b from-black/30 via-transparent to-black/60 opacity-60 group-hover:opacity-40'} transition-opacity`}
			></div>
			{/* Play indicator on hover */}
			<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
				<div
					className={`w-16 h-16 rounded-full ${isLight ? 'bg-white/40' : 'bg-black/40'} backdrop-blur-md flex items-center justify-center`}
				>
					{isPlaying ? (
						<Pause
							className={`w-8 h-8 ${isLight ? 'text-gray-800' : 'text-white'}`}
							fill={isLight ? '#1f2937' : 'white'}
						/>
					) : (
						<Play
							className={`w-8 h-8 ${isLight ? 'text-gray-800' : 'text-white'}`}
							fill={isLight ? '#1f2937' : 'white'}
						/>
					)}
				</div>
			</div>
		</button>
	);
}
