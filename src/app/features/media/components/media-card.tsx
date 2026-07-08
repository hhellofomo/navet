import { lazy, memo, Suspense } from 'react';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { useTheme } from '@/app/hooks';
import albumArt from '@/assets/847d39d7e328a23edbec0f0c53ec4c57b6f1d6fb.png';
import { MediaLargeView } from './media/media-large-view';
import { MediaMediumView } from './media/media-medium-view';
import { MediaSmallView } from './media/media-small-view';
import { useMediaState } from './media/use-media-state';

const MediaDialog = lazy(async () => {
  const module = await import('./media/media-dialog');
  return { default: module.MediaDialog };
});

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
  const { theme } = useTheme();
  const {
    isPlaying,
    volume,
    isMuted,
    isOpen,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    openDialog,
    closeDialog,
    handlePrevious,
    handleNext,
  } = useMediaState();

  const cardId = 'media-1';

  // Size-specific styling with intelligent layout adaptation
  const isSmall = size === 'extra-small' || size === 'small';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const padding = isSmall ? 'p-4' : isLarge ? 'p-6' : 'p-5';
  const isLight = theme === 'light';

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
            <MediaSmallView
              albumArt={albumArt}
              title={title}
              artist={artist}
              isPlaying={isPlaying}
              isLight={isLight}
              onOpenDialog={openDialog}
            />
          ) : isMedium ? (
            <MediaMediumView
              albumArt={albumArt}
              title={title}
              artist={artist}
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
              isLight={isLight}
              onPrevious={handlePrevious}
              onTogglePlay={togglePlay}
              onNext={handleNext}
              onToggleMute={toggleMute}
              onVolumeChange={handleVolumeChange}
            />
          ) : (
            <MediaLargeView
              albumArt={albumArt}
              title={title}
              artist={artist}
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
              isLight={isLight}
              onPrevious={handlePrevious}
              onTogglePlay={togglePlay}
              onNext={handleNext}
              onToggleMute={toggleMute}
              onVolumeChange={handleVolumeChange}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <Suspense fallback={null}>
          <MediaDialog
            isOpen={isOpen}
            onOpenChange={closeDialog}
            albumArt={albumArt}
            title={title}
            artist={artist}
            isPlaying={isPlaying}
            volume={volume}
            isMuted={isMuted}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onVolumeChange={handleVolumeChange}
          />
        </Suspense>
      )}
    </>
  );
});
