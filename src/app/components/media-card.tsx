import * as Dialog from '@radix-ui/react-dialog';
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { memo, useState } from 'react';
import albumArt from '../../assets/847d39d7e328a23edbec0f0c53ec4c57b6f1d6fb.png';
import { useTheme } from '../contexts/theme-context';
import { type CardSize, CardSizeSelector } from './card-size-selector';

interface MediaCardProps {
	title: string;
	artist: string;
	size: CardSize;
	onSizeChange: (id: string, size: CardSize) => void;
	isEditMode: boolean;
}

export const MediaCard = memo(function MediaCard({
	title,
	artist,
	size,
	onSizeChange,
	isEditMode,
}: MediaCardProps) {
	const [isPlaying, setIsPlaying] = useState(true);
	const [volume, setVolume] = useState(70);
	const [isMuted, setIsMuted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const { theme } = useTheme();
	const cardId = 'media-1';

	// Size-specific styling with intelligent layout adaptation
	const isSmall = size === 'small';
	const isMedium = size === 'medium';
	const isLarge = size === 'large';
	const padding = isSmall ? 'p-4' : isLarge ? 'p-6' : 'p-5';
	const isLight = theme === 'light';

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = parseInt(e.target.value, 10);
		setVolume(newVolume);
		if (newVolume > 0 && isMuted) {
			setIsMuted(false);
		}
	};

	const toggleMute = () => {
		setIsMuted(!isMuted);
	};

	return (
		<>
			<div
				className={`relative h-full backdrop-blur-xl rounded-3xl ${padding} border ${isLight ? 'border-gray-200/50 shadow-lg' : 'border-pink-700/20'} overflow-hidden`}
			>
				{isEditMode && (
					<CardSizeSelector
						currentSize={size}
						onSizeChange={(newSize) => onSizeChange(cardId, newSize)}
					/>
				)}

				{/* Melting album art background */}
				<div className="absolute inset-0 overflow-hidden">
					<img
						src={albumArt}
						alt="Album art"
						className={`absolute inset-0 w-full h-full object-cover blur-3xl scale-110 ${isLight ? 'opacity-30' : 'opacity-40'}`}
					/>
					<div
						className={`absolute inset-0 ${isLight ? 'bg-gradient-to-b from-white/70 via-white/50 to-white/80' : 'bg-gradient-to-b from-black/60 via-black/40 to-black/80'}`}
					></div>
				</div>

				<div
					className={`absolute inset-0 bg-gradient-to-br ${isLight ? 'from-pink-200/20' : 'from-pink-500/10'} to-transparent`}
				></div>

				<div className="relative h-full flex flex-col">
					{isSmall ? (
						// Small: Just full album art, click to open dialog
						<div
							className="absolute inset-0 -m-4 cursor-pointer group"
							onClick={(e) => {
								e.stopPropagation();
								setIsOpen(true);
							}}
						>
							<img
								src={albumArt}
								alt={`${title} by ${artist}`}
								className="w-full h-full object-cover"
							/>
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
						</div>
					) : isMedium ? (
						// Medium: Album art on left, controls on right with volume
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
									<div
										className={`font-bold truncate text-sm ${isLight ? 'text-gray-900' : 'text-white'}`}
									>
										{title}
									</div>
									<div
										className={`text-xs truncate ${isLight ? 'text-gray-500' : 'text-gray-400'}`}
									>
										{artist}
									</div>
								</div>

								{/* Playback controls */}
								<div className="flex items-center gap-2">
									<button
										onClick={(e) => {
											e.stopPropagation();
											// Previous track logic
										}}
										className={`w-8 h-8 rounded-full ${isLight ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center transition-colors flex-shrink-0`}
									>
										<SkipBack
											className={`w-3.5 h-3.5 ${isLight ? 'text-gray-800' : 'text-white'}`}
										/>
									</button>

									<button
										onClick={() => setIsPlaying(!isPlaying)}
										className="w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-colors shadow-lg shadow-pink-500/50 flex-shrink-0"
									>
										{isPlaying ? (
											<Pause className="w-4 h-4 text-white" fill="white" />
										) : (
											<Play className="w-4 h-4 text-white" fill="white" />
										)}
									</button>

									<button
										onClick={(e) => {
											e.stopPropagation();
											// Next track logic
										}}
										className={`w-8 h-8 rounded-full ${isLight ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center transition-colors flex-shrink-0`}
									>
										<SkipForward
											className={`w-3.5 h-3.5 ${isLight ? 'text-gray-800' : 'text-white'}`}
										/>
									</button>
								</div>

								{/* Volume bar */}
								<div className="flex items-center gap-2">
									<button
										onClick={toggleMute}
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
											onChange={handleVolumeChange}
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
					) : (
						// Large: Album art at top, info and controls below with volume slider
						<div className="flex-1 flex flex-col items-center justify-center gap-4">
							<img
								src={albumArt}
								alt={`${title} by ${artist}`}
								className="w-32 h-32 rounded-3xl object-cover shadow-2xl"
							/>

							<div className="text-center w-full">
								<div
									className={`font-bold truncate text-lg ${isLight ? 'text-gray-900' : 'text-white'}`}
								>
									{title}
								</div>
								<div className={`text-sm truncate ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
									{artist}
								</div>
							</div>

							<div className="flex items-center justify-center gap-4">
								<button
									className={`w-10 h-10 rounded-full ${isLight ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center transition-colors`}
								>
									<SkipBack className={`w-5 h-5 ${isLight ? 'text-gray-800' : 'text-white'}`} />
								</button>
								<button
									onClick={() => setIsPlaying(!isPlaying)}
									className="w-14 h-14 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-colors shadow-lg shadow-pink-500/50"
								>
									{isPlaying ? (
										<Pause className="w-6 h-6 text-white" fill="white" />
									) : (
										<Play className="w-6 h-6 text-white" fill="white" />
									)}
								</button>
								<button
									className={`w-10 h-10 rounded-full ${isLight ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center transition-colors`}
								>
									<SkipForward className={`w-5 h-5 ${isLight ? 'text-gray-800' : 'text-white'}`} />
								</button>
							</div>

							{/* Volume control */}
							<div className="w-full flex items-center gap-3 px-2">
								<button
									onClick={toggleMute}
									className={`w-8 h-8 rounded-full ${isLight ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center transition-colors flex-shrink-0`}
								>
									{isMuted ? (
										<VolumeX className={`w-4 h-4 ${isLight ? 'text-gray-800' : 'text-white'}`} />
									) : (
										<Volume2 className={`w-4 h-4 ${isLight ? 'text-gray-800' : 'text-white'}`} />
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
										onChange={handleVolumeChange}
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
									/>
								</div>
								<span
									className={`text-xs w-8 text-right ${isLight ? 'text-gray-500' : 'text-gray-400'}`}
								>
									{isMuted ? 0 : volume}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Advanced Settings Dialog */}
			<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
					<Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md max-h-[85vh] overflow-y-auto backdrop-blur-xl rounded-3xl p-8 border border-pink-700/20 shadow-2xl z-50 animate-in fade-in zoom-in duration-200 bg-gradient-to-br from-pink-900/95 to-purple-950/95 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
						<div className="mb-6">
							<Dialog.Title className="text-xl font-semibold text-white">{title}</Dialog.Title>
							<Dialog.Description className="text-sm mt-1 text-gray-400">
								{artist}
							</Dialog.Description>
						</div>

						<div className="space-y-6">
							{/* Album Art */}
							<div className="flex justify-center">
								<img
									src={albumArt}
									alt={`${title} by ${artist}`}
									className="w-48 h-48 rounded-3xl object-cover shadow-2xl"
								/>
							</div>

							{/* Playback Controls */}
							<div className="flex items-center justify-center gap-6">
								<button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
									<SkipBack className="w-6 h-6 text-white" />
								</button>
								<button
									onClick={() => setIsPlaying(!isPlaying)}
									className="w-16 h-16 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-colors shadow-lg shadow-pink-500/50"
								>
									{isPlaying ? (
										<Pause className="w-7 h-7 text-white" fill="white" />
									) : (
										<Play className="w-7 h-7 text-white" fill="white" />
									)}
								</button>
								<button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
									<SkipForward className="w-6 h-6 text-white" />
								</button>
							</div>

							{/* Volume Control */}
							<div>
								<div className="flex items-center justify-between mb-3">
									<span className="text-sm font-medium text-gray-300">Volume</span>
									<span className="text-sm font-semibold text-white">{isMuted ? 0 : volume}%</span>
								</div>
								<div className="flex items-center gap-3">
									<button
										onClick={toggleMute}
										className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
									>
										{isMuted ? (
											<VolumeX className="w-5 h-5 text-white" />
										) : (
											<Volume2 className="w-5 h-5 text-white" />
										)}
									</button>
									<div className="flex-1 relative h-2 bg-white/20 rounded-full overflow-hidden">
										<div
											className="absolute left-0 top-0 h-full bg-pink-500 transition-all duration-150"
											style={{ width: isMuted ? '0%' : `${volume}%` }}
										/>
										<input
											type="range"
											min="0"
											max="100"
											value={isMuted ? 0 : volume}
											onChange={handleVolumeChange}
											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
										/>
									</div>
								</div>
							</div>

							{/* Quick Volume Presets */}
							<div>
								<span className="text-sm font-medium text-gray-300 mb-3 block">Quick Volume</span>
								<div className="grid grid-cols-4 gap-2">
									{[25, 50, 75, 100].map((vol) => (
										<button
											key={vol}
											onClick={() => {
												setVolume(vol);
												if (isMuted) setIsMuted(false);
											}}
											className={`py-3 rounded-xl text-sm font-medium transition-all border-2 ${
												volume === vol && !isMuted
													? 'border-pink-500 bg-pink-500/20 text-white scale-105'
													: 'border-white/10 bg-white/5 text-gray-300 hover:border-pink-500/50'
											}`}
										>
											{vol}%
										</button>
									))}
								</div>
							</div>

							{/* Close button */}
							<Dialog.Close asChild>
								<button className="w-full py-3 bg-pink-500 hover:bg-pink-600 rounded-xl text-white font-medium transition-colors">
									Done
								</button>
							</Dialog.Close>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	);
});
