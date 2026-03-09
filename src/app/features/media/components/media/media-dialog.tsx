import * as Dialog from '@radix-ui/react-dialog';
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';

interface MediaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  albumArt: string;
  title: string;
  artist: string;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
}

export function MediaDialog({
  isOpen,
  onOpenChange,
  albumArt,
  title,
  artist,
  isPlaying,
  volume,
  isMuted,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
}: MediaDialogProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const isGlass = theme === 'glass';
  const controlSurface = isGlass ? `${surface.subtleBg} ${surface.hoverBg}` : 'bg-white/10 hover:bg-white/20';
  const volumeTrack = isGlass ? 'bg-white/12' : 'bg-white/20';
  const presetButton = (isActive: boolean) =>
    isActive
      ? 'border-pink-500 bg-pink-500/20 text-white scale-105'
      : isGlass
        ? `${surface.border} ${surface.subtleBg} text-white/80 hover:border-pink-500/50`
        : 'border-white/10 bg-white/5 text-gray-300 hover:border-pink-500/50';
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={`fixed inset-0 z-50 animate-in fade-in ${surface.dialogBackdrop}`} />
        <Dialog.Content className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md max-h-[85vh] overflow-y-auto backdrop-blur-xl rounded-3xl p-8 border shadow-2xl z-50 animate-in fade-in zoom-in duration-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
          isGlass
            ? 'bg-gradient-to-br from-white/12 via-pink-300/10 to-white/[0.04] border-white/18'
            : 'bg-gradient-to-br from-pink-900/95 to-purple-950/95 border-pink-700/20'
        }`}>
          <div className="mb-6">
            <Dialog.Title className={`text-xl font-semibold ${surface.textPrimary}`}>{title}</Dialog.Title>
            <Dialog.Description className={`text-sm mt-1 ${surface.textSecondary}`}>{artist}</Dialog.Description>
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
              <button
                type="button"
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${controlSurface}`}
              >
                <SkipBack className={`w-6 h-6 ${surface.textPrimary}`} />
              </button>
              <button
                type="button"
                onClick={onTogglePlay}
                className="w-16 h-16 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-colors shadow-lg shadow-pink-500/50"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-white" fill="white" />
                ) : (
                  <Play className="w-7 h-7 text-white" fill="white" />
                )}
              </button>
              <button
                type="button"
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${controlSurface}`}
              >
                <SkipForward className={`w-6 h-6 ${surface.textPrimary}`} />
              </button>
            </div>

            {/* Volume Control */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${surface.textSecondary}`}>Volume</span>
                <span className={`text-sm font-semibold ${surface.textPrimary}`}>{isMuted ? 0 : volume}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onToggleMute}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${controlSurface}`}
                >
                  {isMuted ? (
                    <VolumeX className={`w-5 h-5 ${surface.textPrimary}`} />
                  ) : (
                    <Volume2 className={`w-5 h-5 ${surface.textPrimary}`} />
                  )}
                </button>
                <div className={`flex-1 relative h-2 rounded-full overflow-hidden ${volumeTrack}`}>
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
              </div>
            </div>

            {/* Quick Volume Presets */}
            <div>
              <span className={`text-sm font-medium ${surface.textSecondary} mb-3 block`}>Quick Volume</span>
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
