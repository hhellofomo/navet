import { lazy, memo, Suspense } from 'react';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { getCardStateSurfaceTokens } from '@/app/components/shared/theme/card-state-surface-tokens';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import { MediaLargeView } from '../media/media-large-view';
import { MediaMediumView } from '../media/media-medium-view';
import { MediaSmallView } from '../media/media-small-view';
import { useMediaCardController } from './use-media-card-controller';

const MediaDialog = lazy(async () => {
  const module = await import('../media/media-dialog');
  return { default: module.MediaDialog };
});

interface MediaCardProps {
  id: string;
  name: string;
  room: string;
  title: string;
  artist: string;
  entityPicture?: string;
  state: 'playing' | 'paused' | 'idle' | 'off';
  volume: number;
  isMuted: boolean;
  elapsedSeconds?: number;
  durationSeconds?: number;
  positionUpdatedAt?: string;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

export const MediaCard = memo(function MediaCard({
  id,
  name: _name,
  room: _room,
  title,
  artist,
  entityPicture,
  state,
  volume: initialVolume,
  isMuted: initialMuted,
  elapsedSeconds: initialElapsedSeconds,
  durationSeconds: initialDurationSeconds,
  positionUpdatedAt: initialPositionUpdatedAt,
  size,
  onSizeChange,
  isEditMode,
}: MediaCardProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const {
    albumArt: resolvedAlbumArt,
    closeDialog,
    durationSeconds,
    elapsedSeconds,
    handleNext,
    handlePrevious,
    handleVolumeChange,
    isOff,
    isPlaying,
    isMuted,
    isOpen,
    openDialog,
    toggleMute,
    togglePlay,
    volume,
  } = useMediaCardController({
    entityId: id,
    entityPicture,
    initialState: state,
    initialVolume,
    initialMuted,
    initialElapsedSeconds,
    initialDurationSeconds,
    initialPositionUpdatedAt,
  });
  const stateSurface = getCardStateSurfaceTokens(theme, !isOff);

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
        className={`relative h-full backdrop-blur-xl rounded-3xl ${padding} border ${cardBorder} ${cardShadow} ${shellBg} ${stateSurface.containerClassName} overflow-hidden`}
      >
        {isEditMode && (
          <CardSizeSelector
            currentSize={size}
            onSizeChange={(newSize) => onSizeChange(id, newSize)}
          />
        )}

        <div className="absolute inset-0 overflow-hidden">
          {resolvedAlbumArt ? (
            <img
              src={resolvedAlbumArt}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover blur-3xl scale-110 ${artworkOpacity} ${stateSurface.artworkClassName}`}
            />
          ) : null}
          <div className={`absolute inset-0 ${artworkOverlay}`}></div>
        </div>

        <div className={`absolute inset-0 bg-gradient-to-br ${artworkGlow} to-transparent`}></div>

        {stateSurface.overlayClassName && (
          <div className={`absolute inset-0 ${stateSurface.overlayClassName}`}></div>
        )}

        <div className="relative h-full flex flex-col">
          {isSmall ? (
            <MediaSmallView
              artwork={resolvedAlbumArt}
              title={title}
              artist={artist}
              isActive={!isOff}
              isPlaying={isPlaying}
              volume={volume}
              elapsedSeconds={elapsedSeconds}
              theme={theme}
              onPrevious={handlePrevious}
              onTogglePlay={togglePlay}
              onNext={handleNext}
              onVolumeChange={handleVolumeChange}
              onOpenDialog={openDialog}
            />
          ) : isMedium ? (
            <MediaMediumView
              artwork={resolvedAlbumArt}
              title={title}
              artist={artist}
              isActive={!isOff}
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
              elapsedSeconds={elapsedSeconds}
              theme={theme}
              onOpenDialog={openDialog}
              onPrevious={handlePrevious}
              onTogglePlay={togglePlay}
              onNext={handleNext}
              onToggleMute={toggleMute}
              onVolumeChange={handleVolumeChange}
            />
          ) : (
            <MediaLargeView
              artwork={resolvedAlbumArt}
              title={title}
              artist={artist}
              isActive={!isOff}
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
              elapsedSeconds={elapsedSeconds}
              theme={theme}
              onOpenDialog={openDialog}
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
            artwork={resolvedAlbumArt}
            title={title}
            artist={artist}
            isPlaying={isPlaying}
            volume={volume}
            isMuted={isMuted}
            elapsedSeconds={elapsedSeconds}
            durationSeconds={durationSeconds}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onVolumeChange={handleVolumeChange}
          />
        </Suspense>
      )}
    </>
  );
});
