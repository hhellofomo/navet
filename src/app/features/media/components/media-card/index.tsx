import { lazy, memo, Suspense } from 'react';
import {
  type CardSize,
  CardSizeSelector,
  getCompactCardSize,
} from '@/app/components/shared/card-size-selector';
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

const mediaCardSizeOptions = [
  {
    value: 'small' as const,
    label: 'Small',
    description: '1 × 1',
    dimensions: 'Square tile',
    preview: 'w-7 h-7',
  },
  {
    value: 'medium' as const,
    label: 'Medium',
    description: '2 × 1',
    dimensions: 'Wide tile',
    preview: 'w-14 h-7',
  },
  {
    value: 'large' as const,
    label: 'Medium',
    description: '1 × 2',
    dimensions: 'Vertical tile',
    preview: 'w-7 h-14',
  },
];

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
  const mediaSize = getCompactCardSize(size);
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

  const isSmall = mediaSize === 'small';
  const isMedium = mediaSize === 'medium';
  const isMediumVertical = mediaSize === 'large';
  const padding = isSmall ? 'p-4' : isMediumVertical ? 'p-6' : 'p-5';
  const isLight = theme === 'light';
  const isGlass = theme === 'glass';
  const cardBorder = isLight
    ? 'border-gray-200/50'
    : isGlass
      ? surface.border
      : 'border-pink-700/20';
  const cardShadow = isLight ? 'shadow-lg' : surface.cardShadow;
  const hasArtwork = Boolean(resolvedAlbumArt);
  const shellBg = hasArtwork
    ? 'bg-transparent'
    : isLight
      ? 'bg-white/70'
      : isGlass
        ? 'bg-white/8'
        : 'bg-black/20';
  const shellBlur = hasArtwork ? '' : 'backdrop-blur-xl';

  return (
    <>
      <div
        className={`relative h-full rounded-3xl ${padding} border ${cardBorder} ${cardShadow} ${shellBg} ${shellBlur} ${stateSurface.containerClassName} overflow-hidden`}
      >
        {isEditMode && (
          <CardSizeSelector
            currentSize={mediaSize}
            triggerSize={mediaSize === 'large' ? 'medium' : mediaSize}
            onSizeChange={(newSize) => onSizeChange(id, newSize)}
            allowedSizes={['small', 'medium', 'large']}
            options={mediaCardSizeOptions}
          />
        )}

        {stateSurface.overlayClassName && (
          <div className={`absolute inset-0 ${stateSurface.overlayClassName}`}></div>
        )}

        <div className="relative h-full flex flex-col">
          {isSmall ? (
            <MediaSmallView
              entityId={id}
              artwork={resolvedAlbumArt}
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
