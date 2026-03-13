import * as Dialog from '@radix-ui/react-dialog';
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { EntityRoomSelector } from '@/app/components/shared/entity-room-selector';
import { RoundControlButton } from '@/app/components/shared/round-control-button';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import { MediaFallbackArtwork } from './media-fallback-artwork';
import { formatMediaTime } from './media-time';
import { useMediaArtworkColors } from './use-media-artwork-colors';

interface MediaDialogProps {
  entityId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  artwork?: string | null;
  onArtworkError?: (imageUrl?: string | null) => void;
  title: string;
  artist: string;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  elapsedSeconds: number;
  durationSeconds: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
}

export function MediaDialog({
  entityId,
  isOpen,
  onOpenChange,
  artwork,
  onArtworkError,
  title,
  artist,
  isPlaying,
  volume,
  isMuted,
  elapsedSeconds,
  durationSeconds,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
}: MediaDialogProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const isGlass = theme === 'glass';
  const palette = useMediaArtworkColors(artwork, theme, 'media-dialog', `${title}::${artist}`);
  const displayRemaining = formatMediaTime(Math.max(0, durationSeconds - elapsedSeconds));
  const displayDuration = durationSeconds > 0 ? formatMediaTime(durationSeconds) : '--:--';
  const presetButton = (isActive: boolean) =>
    isActive
      ? 'border-pink-500 bg-pink-500/20 text-white scale-105'
      : isGlass
        ? `${surface.border} ${surface.subtleBg} text-white/80 hover:border-pink-500/50`
        : 'border-white/10 bg-white/5 text-gray-300 hover:border-pink-500/50';
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={`fixed inset-0 z-50 animate-in fade-in ${surface.dialogBackdrop}`}
        />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md max-h-[85vh] overflow-y-auto backdrop-blur-xl rounded-3xl p-8 border shadow-2xl z-50 animate-in fade-in zoom-in duration-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
            isGlass
              ? 'bg-gradient-to-br from-white/12 via-pink-300/10 to-white/[0.04] border-white/18'
              : 'bg-gradient-to-br from-pink-900/95 to-purple-950/95 border-pink-700/20'
          }`}
        >
          <div className="mb-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Dialog.Title className={`text-xl font-semibold ${surface.textPrimary}`}>
                  {title}
                </Dialog.Title>
                <Dialog.Description className={`text-sm mt-1 ${surface.textSecondary}`}>
                  {artist}
                </Dialog.Description>
              </div>
              <EntityRoomSelector entityId={entityId} label="Room" compact className="w-32" />
            </div>
          </div>

          <div className="space-y-6">
            {/* Album Art */}
            <div className="flex justify-center">
              {artwork ? (
                <img
                  src={artwork}
                  alt={`${title} by ${artist}`}
                  onError={() => onArtworkError?.(artwork)}
                  className="h-48 w-48 rounded-3xl object-cover shadow-2xl"
                />
              ) : (
                <MediaFallbackArtwork
                  palette={palette}
                  className="relative h-48 w-48 rounded-3xl shadow-2xl"
                />
              )}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-6">
              <RoundControlButton
                theme={theme}
                size="large"
                variant="neutral"
                className="h-12 w-12 transition-colors"
              >
                <SkipBack className="h-6 w-6" />
              </RoundControlButton>
              <RoundControlButton
                theme={theme}
                size="large"
                variant="emphasis"
                onClick={onTogglePlay}
                className="h-16 w-16 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-7 w-7" fill="currentColor" />
                ) : (
                  <Play className="h-7 w-7" fill="currentColor" />
                )}
              </RoundControlButton>
              <RoundControlButton
                theme={theme}
                size="large"
                variant="neutral"
                className="h-12 w-12 transition-colors"
              >
                <SkipForward className="h-6 w-6" />
              </RoundControlButton>
            </div>

            {/* Volume Control */}
            <div>
              {isPlaying && (
                <div className="mb-3 flex items-center justify-between">
                  <span className={`text-sm ${surface.textSecondary}`}>{displayRemaining}</span>
                  <span className={`text-sm ${surface.textSecondary}`}>{displayDuration}</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${surface.textSecondary}`}>Volume</span>
                <span className={`text-sm font-semibold ${surface.textPrimary}`}>
                  {isMuted ? 0 : volume}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <RoundControlButton
                  theme={theme}
                  size="medium"
                  variant="neutral"
                  onClick={onToggleMute}
                  className="h-10 w-10 transition-colors"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </RoundControlButton>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="absolute left-0 top-0 h-full bg-white transition-all duration-150"
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
              </div>
            </div>

            {/* Quick Volume Presets */}
            <div>
              <span className={`text-sm font-medium ${surface.textSecondary} mb-3 block`}>
                Quick Volume
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((vol) => (
                  <button
                    type="button"
                    key={vol}
                    onClick={() => {
                      onVolumeChange(vol);
                      if (isMuted) {
                        // Toggle mute off when setting volume
                      }
                    }}
                    className={`py-3 rounded-xl text-sm font-medium transition-all border-2 ${presetButton(
                      volume === vol && !isMuted
                    )}`}
                  >
                    {vol}%
                  </button>
                ))}
              </div>
            </div>

            {/* Close button */}
            <Dialog.Close asChild>
              <button
                type="button"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 rounded-xl text-white font-medium transition-colors"
              >
                Done
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
