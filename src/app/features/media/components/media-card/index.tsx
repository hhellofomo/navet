import { lazy, memo, Suspense } from 'react';
import { type CardSize, getCompactCardSize } from '@/app/components/shared/card-size-selector';
import { getCardShellSurfaceTokens } from '@/app/components/shared/theme/card-shell-surface-tokens';
import { getCardStateSurfaceTokens } from '@/app/components/shared/theme/card-state-surface-tokens';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import { MediaMediumVerticalView } from '../media/media-medium-vertical-view';
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
  onSizeChange: _onSizeChange,
  isEditMode: _isEditMode,
}: MediaCardProps) {
  const { theme, colors } = useTheme();
  const cardShell = getCardShellSurfaceTokens(theme);
  const surface = getThemeSurfaceTokens(theme);
  const mediaSize = getCompactCardSize(size);
  const {
    albumArt: resolvedAlbumArt,
    closeDialog,
    durationSeconds,
    elapsedSeconds,
    handleArtworkError,
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
    artworkKey: [entityPicture, title, artist].filter(Boolean).join('::'),
    initialState: state,
    initialVolume,
    initialMuted,
    initialElapsedSeconds,
    initialDurationSeconds,
    initialPositionUpdatedAt,
  });
  const stateSurface = getCardStateSurfaceTokens(theme, !isOff);

  const isSmall = mediaSize === 'small';
  const isMedium = mediaSize === 'medium';
  const isMediumVertical = mediaSize === 'large';
  const padding = isSmall ? 'p-4' : isMediumVertical ? 'p-6' : 'p-5';
  const isLight = theme === 'light';
  const isGlass = theme === 'glass';
  const hasArtwork = Boolean(resolvedAlbumArt);
  const inactiveShellBg = `bg-gradient-to-br ${colors.media.off.gradient}`;
  const inactiveShellBorder = colors.media.off.border;
  const cardBorder = hasArtwork ? 'border-transparent' : surface.border;
  const cardShadow = '';
  const shellBg = hasArtwork
    ? isGlass
      ? 'bg-transparent'
      : isLight
        ? 'bg-white'
        : 'bg-zinc-950'
    : isOff
      ? inactiveShellBg
      : isLight
        ? 'bg-white'
        : isGlass
          ? 'bg-white/8'
          : 'bg-zinc-900';
  const shellBorder = isOff ? inactiveShellBorder : cardBorder;
  const shellBlur = hasArtwork ? '' : cardShell.backdropClassName;
  const shellOverlayClassName = isOff && !hasArtwork ? null : stateSurface.overlayClassName;

  return (
    <>
      <div
        className={`relative h-full rounded-3xl ${padding} ${theme !== 'dark' ? 'border' : ''} ${shellBorder} ${cardShadow} ${shellBg} ${shellBlur} ${stateSurface.containerClassName} overflow-hidden`}
      >
        {shellOverlayClassName && (
          <div className={`absolute inset-0 ${shellOverlayClassName}`}></div>
        )}

        <div className="relative h-full flex flex-col">
          {isSmall ? (
            <MediaSmallView
              entityId={id}
              artwork={resolvedAlbumArt}
              onArtworkError={handleArtworkError}
              title={title}
              artist={artist}
              isActive={!isOff}
              isPlaying={isPlaying}
              volume={volume}
              elapsedSeconds={elapsedSeconds}
              durationSeconds={durationSeconds}
              theme={theme}
              onPrevious={handlePrevious}
              onTogglePlay={togglePlay}
              onNext={handleNext}
              onVolumeChange={handleVolumeChange}
              onOpenDialog={openDialog}
            />
          ) : isMedium ? (
            <MediaMediumView
              entityId={id}
              artwork={resolvedAlbumArt}
              onArtworkError={handleArtworkError}
              title={title}
              artist={artist}
              isActive={!isOff}
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
              elapsedSeconds={elapsedSeconds}
              durationSeconds={durationSeconds}
              theme={theme}
              onOpenDialog={openDialog}
              onPrevious={handlePrevious}
              onTogglePlay={togglePlay}
              onNext={handleNext}
              onToggleMute={toggleMute}
              onVolumeChange={handleVolumeChange}
            />
          ) : (
            <MediaMediumVerticalView
              entityId={id}
              artwork={resolvedAlbumArt}
              onArtworkError={handleArtworkError}
              title={title}
              artist={artist}
              isActive={!isOff}
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
              elapsedSeconds={elapsedSeconds}
              durationSeconds={durationSeconds}
              theme={theme}
              onOpenDialog={openDialog}
              onPrevious={handlePrevious}
              onTogglePlay={togglePlay}
              onNext={handleNext}
              onVolumeChange={handleVolumeChange}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <Suspense fallback={null}>
          <MediaDialog
            entityId={id}
            isOpen={isOpen}
            onOpenChange={closeDialog}
            artwork={resolvedAlbumArt}
            onArtworkError={handleArtworkError}
            title={title}
            artist={artist}
            isPlaying={isPlaying}
            volume={volume}
            isMuted={isMuted}
            elapsedSeconds={elapsedSeconds}
            durationSeconds={durationSeconds}
            onPrevious={handlePrevious}
            onTogglePlay={togglePlay}
            onNext={handleNext}
            onToggleMute={toggleMute}
            onVolumeChange={handleVolumeChange}
          />
        </Suspense>
      )}
    </>
  );
});
