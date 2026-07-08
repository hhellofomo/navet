import { lazy, memo, Suspense } from 'react';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import albumArt from '@/assets/847d39d7e328a23edbec0f0c53ec4c57b6f1d6fb.png';
import { MediaLargeView } from '../media/media-large-view';
import { MediaMediumView } from '../media/media-medium-view';
import { MediaSmallView } from '../media/media-small-view';
import { useMediaState } from '../media/use-media-state';

const MediaDialog = lazy(async () => {
  const module = await import('../media/media-dialog');
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
  const surface = getThemeSurfaceTokens(theme);
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
  const isSmall = size === 'extra-small' || size === 'small';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const padding = isSmall ? 'p-4' : isLarge ? 'p-6' : 'p-5';
  const isLight = theme === 'light';
  const isGlass = theme === 'glass';
  const cardBorder = isLight
    ? 'border-gray-200/50'
    : isGlass
      ? surface.border
      : 'border-pink-700/20';
  const cardShadow = isLight ? 'shadow-lg' : surface.cardShadow;
  const artworkOverlay = isLight
    ? 'bg-gradient-to-b from-white/70 via-white/50 to-white/80'
    : isGlass
      ? 'bg-gradient-to-b from-slate-950/52 via-slate-950/34 to-slate-950/66'
      : 'bg-gradient-to-b from-black/60 via-black/40 to-black/80';
  const artworkGlow = isLight
    ? 'from-pink-200/20'
    : isGlass
      ? 'from-white/12 via-pink-300/10'
      : 'from-pink-500/10';
  const artworkOpacity = isLight ? 'opacity-30' : isGlass ? 'opacity-34' : 'opacity-40';
  const shellBg = isLight ? 'bg-white/70' : isGlass ? 'bg-white/8' : 'bg-black/20';

  return (
    <>
      <div
        className={`relative h-full backdrop-blur-xl rounded-3xl ${padding} border ${cardBorder} ${cardShadow} ${shellBg} overflow-hidden`}
      >
        {isEditMode && (
          <CardSizeSelector
            currentSize={size}
            onSizeChange={(newSize) => onSizeChange(cardId, newSize)}
          />
        )}

        <div className="absolute inset-0 overflow-hidden">
          <img
            src={albumArt}
            alt="Album art"
            className={`absolute inset-0 w-full h-full object-cover blur-3xl scale-110 ${artworkOpacity}`}
          />
          <div className={`absolute inset-0 ${artworkOverlay}`}></div>
        </div>

        <div className={`absolute inset-0 bg-gradient-to-br ${artworkGlow} to-transparent`}></div>

        <div className="relative h-full flex flex-col">
          {isSmall ? (
            <MediaSmallView
              albumArt={albumArt}
              title={title}
              artist={artist}
              isPlaying={isPlaying}
              theme={theme}
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
              theme={theme}
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
              theme={theme}
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
