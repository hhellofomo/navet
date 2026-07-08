import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';

interface MediaLargeViewProps {
  albumArt: string;
  title: string;
  artist: string;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isLight: boolean;
  theme: ThemeType;
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
  theme,
  onPrevious: _onPrevious,
  onTogglePlay,
  onNext: _onNext,
  onToggleMute,
  onVolumeChange,
}: MediaLargeViewProps) {
  const surface = getThemeSurfaceTokens(theme);
  const buttonSurface = isLight
    ? 'bg-gray-900/10 hover:bg-gray-900/20'
    : `${surface.subtleBg} ${surface.hoverBg}`;
  const iconColor = isLight ? 'text-gray-800' : surface.textPrimary;
  const volumeTrack = isLight
    ? 'bg-gray-900/15'
    : theme === 'glass'
      ? 'bg-white/12'
      : 'bg-white/20';
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <img
        src={albumArt}
        alt={`${title} by ${artist}`}
        className="w-32 h-32 rounded-3xl object-cover shadow-2xl"
      />

      <div className="text-center w-full">
        <div className={`font-bold truncate text-lg ${surface.textPrimary}`}>{title}</div>
        <div className={`text-sm truncate ${isLight ? 'text-gray-500' : surface.textSecondary}`}>
          {artist}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={_onPrevious}
          className={`w-10 h-10 rounded-full ${buttonSurface} flex items-center justify-center transition-colors`}
        >
          <SkipBack className={`w-5 h-5 ${iconColor}`} />
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
          className={`w-10 h-10 rounded-full ${buttonSurface} flex items-center justify-center transition-colors`}
        >
          <SkipForward className={`w-5 h-5 ${iconColor}`} />
        </button>
      </div>

      {/* Volume control */}
      <div className="w-full flex items-center gap-3 px-2">
        <button
          type="button"
          onClick={onToggleMute}
          className={`w-8 h-8 rounded-full ${buttonSurface} flex items-center justify-center transition-colors flex-shrink-0`}
        >
          {isMuted ? (
            <VolumeX className={`w-4 h-4 ${iconColor}`} />
          ) : (
            <Volume2 className={`w-4 h-4 ${iconColor}`} />
          )}
        </button>
        <div className={`flex-1 relative h-1 ${volumeTrack} rounded-full overflow-hidden`}>
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
          className={`text-xs w-8 text-right ${isLight ? 'text-gray-500' : surface.textSecondary}`}
        >
          {isMuted ? 0 : volume}%
        </span>
      </div>
    </div>
  );
}
