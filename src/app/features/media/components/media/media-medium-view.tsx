import { SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface MediaMediumViewProps {
	albumArt: string;
	title: string;
	artist: string;
	isPlaying: boolean;
	volume: number;
	isMuted: boolean;
	isLight: boolean;
	onPrevious: () => void;
	onTogglePlay: () => void;
	onNext: () => void;
	onToggleMute: () => void;
	onVolumeChange: (value: number) => void;
}

export function MediaMediumView({
	albumArt,
	title,
	artist,
	isPlaying,
	volume,
	isMuted,
	isLight,
	onPrevious,
	onTogglePlay,
	onNext,
	onToggleMute,
	onVolumeChange,
}: MediaMediumViewProps) {
	return (
		<div className="flex-1 flex items-stretch gap-3 -m-5">
			{/* Album art with blending */}
			<div className="relative w-40 flex-shrink-0 overflow-hidden">
				<img
					src={albumArt}
					alt={`${title} by ${artist}`}
					className="absolute inset-0 w-full h-full object-cover"
				/>
				{/* Gradient blend to the right */}
				<div
					className={`absolute inset-y-0 right-0 w-12 ${isLight ? 'bg-gradient-to-l from-white/80 to-transparent' : 'bg-gradient-to-l from-black/80 to-transparent'}`}
				></div>
			</div>

			<div className="flex-1 flex flex-col justify-center gap-3 min-w-0 pr-5 py-5">
				<div>
					<div className={`font-bold truncate text-sm ${isLight ? 'text-gray-900' : 'text-white'}`}>
						{title}
					</div>
					<div className={`text-xs truncate ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
						{artist}
					</div>
				</div>

				{/* Playback controls */}
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onPrevious();
						}}
						className={`w-8 h-8 rounded-full ${isLight ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center transition-colors flex-shrink-0`}
					>
						<SkipBack className={`w-3.5 h-3.5 ${isLight ? 'text-gray-800' : 'text-white'}`} />
					</button>

					<button
						type="button"
						onClick={onTogglePlay}
						className="w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-colors shadow-lg shadow-pink-500/50 flex-shrink-0"
					>
						{isPlaying ? (
							<Pause className="w-4 h-4 text-white" fill="white" />
						) : (
							<Play className="w-4 h-4 text-white" fill="white" />
						)}
					</button>

					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onNext();
						}}
						className={`w-8 h-8 rounded-full ${isLight ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center transition-colors flex-shrink-0`}
					>
						<SkipForward className={`w-3.5 h-3.5 ${isLight ? 'text-gray-800' : 'text-white'}`} />
					</button>
				</div>

				{/* Volume bar */}
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={onToggleMute}
						className={`w-7 h-7 rounded-full ${isLight ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center transition-colors flex-shrink-0`}
					>
						{isMuted ? (
							<VolumeX className={`w-3 h-3 ${isLight ? 'text-gray-800' : 'text-white'}`} />
						) : (
							<Volume2 className={`w-3 h-3 ${isLight ? 'text-gray-800' : 'text-white'}`} />
						)}
					</button>
					<div
						className={`flex-1 relative h-1 ${isLight ? 'bg-gray-900/15' : 'bg-white/20'} rounded-full overflow-hidden`}
					>
						<div
							className="absolute left-0 top-0 h-full bg-pink-500 transition-all duration-150"
							style={{ width: isMuted ? '0%' : `${volume}%` }}
						/>
						<input
							type="range"
							min="0"
							max="100"
							value={isMuted ? 0 : volume}
							onChange={(e) => onVolumeChange(parseInt(e.target.value, 10))}
							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						/>
					</div>
					<span
						className={`text-[10px] w-6 text-right ${isLight ? 'text-gray-500' : 'text-gray-400'}`}
					>
						{isMuted ? 0 : volume}
					</span>
				</div>
			</div>
		</div>
	);
}
