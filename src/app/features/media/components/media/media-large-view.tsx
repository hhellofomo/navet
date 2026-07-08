import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface MediaLargeViewProps {
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

export function MediaLargeView({
  albumArt,
  title,
  artist,
  isPlaying,
  volume,
  isMuted,
  isLight,
  onPrevious: _onPrevious,
  onTogglePlay,
  onNext: _onNext,
  onToggleMute,
  onVolumeChange,
}: MediaLargeViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <img
        src={albumArt}
        alt={`${title} by ${artist}`}
        className="w-32 h-32 rounded-3xl object-cover shadow-2xl"
      />

      <div className="text-center w-full">
        <div className={`font-bold truncate text-lg ${isLight ? 'text-gray-900' : 'text-white'}`}>
          {title}
        </div>
        <div className={`text-sm truncate ${isLight ? 'text-gray-500' : 'text-gray-300'}`}>
          {artist}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={_onPrevious}
          className={`w-10 h-10 rounded-full ${isLight ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center transition-colors`}
        >
          <SkipBack className={`w-5 h-5 ${isLight ? 'text-gray-800' : 'text-white'}`} />
        </button>
        <button
          type="button"
          onClick={onTogglePlay}
          className="w-14 h-14 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-colors shadow-lg shadow-pink-500/50"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" fill="white" />
          ) : (
            <Play className="w-6 h-6 text-white" fill="white" />
          )}
        </button>
        <button
          type="button"
          onClick={_onNext}
          className={`w-10 h-10 rounded-full ${isLight ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center transition-colors`}
        >
          <SkipForward className={`w-5 h-5 ${isLight ? 'text-gray-800' : 'text-white'}`} />
        </button>
      </div>

      {/* Volume control */}
      <div className="w-full flex items-center gap-3 px-2">
        <button
          type="button"
          onClick={onToggleMute}
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
            onChange={(e) => onVolumeChange(parseInt(e.target.value, 10))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <span className={`text-xs w-8 text-right ${isLight ? 'text-gray-500' : 'text-gray-300'}`}>
          {isMuted ? 0 : volume}%
        </span>
      </div>
    </div>
  );
}
