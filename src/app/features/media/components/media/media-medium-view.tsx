import { ListMusic, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { getCardActionControlSizes } from '@/app/components/shared/card-action-control-sizes';
import { RoundControlButton } from '@/app/components/shared/round-control-button';
import { getCardStateSurfaceTokens } from '@/app/components/shared/theme/card-state-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';
import { getMediaControlStyles } from './media-control-styles';
import { formatMediaTime } from './media-time';
import { MediaVisualizerButton } from './media-visualizer-button';

interface MediaMediumViewProps {
  artwork?: string | null;
  title: string;
  artist: string;
  isActive: boolean;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  elapsedSeconds: number;
  theme: ThemeType;
  onOpenDialog: () => void;
  onPrevious: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
}

export function MediaMediumView({
  artwork,
  title,
  artist,
  isActive,
  isPlaying,
  volume,
  isMuted,
  elapsedSeconds,
  theme,
  onOpenDialog,
  onPrevious,
  onTogglePlay,
  onNext,
  onToggleMute,
  onVolumeChange,
}: MediaMediumViewProps) {
  const displayVolume = Math.max(0, Math.min(100, isMuted ? 0 : volume));
  const stateSurface = getCardStateSurfaceTokens(theme, isActive);
  const iconTone = stateSurface.primaryTextClassName;
  const subtitleTone = stateSurface.secondaryTextClassName;
  const overlay =
    theme === 'light'
      ? 'bg-[radial-gradient(circle_at_76%_28%,rgba(255,255,255,0.14),transparent_18%),linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.1)_34%,rgba(0,0,0,0.5))]'
      : theme === 'glass'
        ? 'bg-[radial-gradient(circle_at_76%_28%,rgba(255,255,255,0.12),transparent_18%),linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.06)_34%,rgba(2,6,23,0.52))]'
        : 'bg-[radial-gradient(circle_at_76%_28%,rgba(255,255,255,0.08),transparent_18%),linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.58))]';
  const readabilityWash =
    theme === 'light'
      ? 'bg-[linear-gradient(90deg,rgba(0,0,0,0.42),rgba(0,0,0,0.12)_34%,rgba(0,0,0,0.36)_100%)]'
      : 'bg-[linear-gradient(90deg,rgba(0,0,0,0.5),rgba(0,0,0,0.12)_34%,rgba(0,0,0,0.42)_100%)]';
  const displayElapsed = formatMediaTime(elapsedSeconds);
  const controls = getMediaControlStyles(theme);
  const controlSizes = getCardActionControlSizes('small');
  const primaryControlSizes = getCardActionControlSizes('medium');

  return (
    <div className="relative -m-5 flex flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        {artwork ? (
          <img
            src={artwork}
            alt=""
            aria-hidden="true"
            className="h-full w-full scale-[1.06] object-cover"
          />
        ) : null}
        <div className={`absolute inset-0 ${overlay}`} />
        <div className={`absolute inset-0 ${readabilityWash}`} />
      </div>

      <div className="relative z-[1] flex h-full w-full flex-col p-4">
        <div className="flex items-center gap-2.5">
          <MediaVisualizerButton
            isPlaying={isPlaying}
            onClick={(event) => {
              event.stopPropagation();
              onOpenDialog();
            }}
            className={iconTone}
          />
          {isPlaying && <span className={`text-[11px] ${subtitleTone}`}>{displayElapsed}</span>}
        </div>

        <div className="mt-auto flex items-end justify-between gap-5">
          <div className="min-w-0">
            <div className={`truncate text-[15px] font-medium ${iconTone}`}>{title}</div>
            <div className={`mt-0.5 truncate text-[13px] ${subtitleTone}`}>{artist}</div>
          </div>

          <RoundControlButton
            theme={theme}
            size="medium"
            variant="emphasis"
            aria-label={isPlaying ? 'Pause playback' : 'Resume playback'}
            onClick={(event) => {
              event.stopPropagation();
              onTogglePlay();
            }}
            className="h-13 w-13 hover:scale-[1.03] active:scale-95"
          >
            {isPlaying ? (
              <Pause className={primaryControlSizes.icon} fill="currentColor" />
            ) : (
              <Play className={primaryControlSizes.icon} fill="currentColor" />
            )}
          </RoundControlButton>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <RoundControlButton
            theme={theme}
            size="small"
            variant="neutral"
            aria-label="Previous track"
            onClick={(event) => {
              event.stopPropagation();
              onPrevious();
            }}
            className="transition-colors"
          >
            <SkipBack className={controlSizes.icon} />
          </RoundControlButton>

          <div className="relative flex-1">
            <div
              className={`absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 ${controls.trackBase}`}
            />
            <div
              className={`absolute left-0 top-1/2 h-px -translate-y-1/2 ${controls.trackFill}`}
              style={{ width: `${displayVolume}%` }}
            />
            <div
              className={`absolute top-1/2 h-4 w-px -translate-y-1/2 rounded-full ${controls.trackThumb}`}
              style={{ left: `calc(${displayVolume}% - 0.5px)` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={displayVolume}
              onChange={(event) => onVolumeChange(parseInt(event.target.value, 10))}
              className="absolute inset-0 h-6 w-full -translate-y-1/2 cursor-pointer opacity-0"
            />
          </div>

          <RoundControlButton
            theme={theme}
            size="small"
            variant="neutral"
            aria-label="Next track"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            className="transition-colors"
          >
            <SkipForward className={controlSizes.icon} />
          </RoundControlButton>

          <RoundControlButton
            theme={theme}
            size="small"
            variant="neutral"
            aria-label={isMuted ? 'Unmute volume' : 'Mute volume'}
            onClick={(event) => {
              event.stopPropagation();
              onToggleMute();
            }}
            className="transition-colors"
          >
            {isMuted ? (
              <VolumeX className={controlSizes.icon} />
            ) : (
              <Volume2 className={controlSizes.icon} />
            )}
          </RoundControlButton>

          <RoundControlButton
            theme={theme}
            size="small"
            variant="neutral"
            aria-label="Open media details"
            onClick={(event) => {
              event.stopPropagation();
              onOpenDialog();
            }}
            className="transition-colors"
          >
            <ListMusic className={controlSizes.icon} />
          </RoundControlButton>
        </div>
      </div>
    </div>
  );
}
