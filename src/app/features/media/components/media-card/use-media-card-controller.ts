import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/auth-context';
import { fetchMediaThumbnailDataUrl } from '@/app/features/media/utils/media-thumbnail';
import { useHomeAssistant, useI18n } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import { homeAssistantSelectors } from '@/app/stores/selectors';
import {
  resolveHomeAssistantAbsoluteUrl,
  resolveHomeAssistantProxyUrl,
} from '@/app/utils/home-assistant-url';

interface UseMediaCardControllerParams {
  entityId: string;
  entityPicture?: string;
  artworkKey?: string;
  initialState: 'playing' | 'paused' | 'idle' | 'off';
  initialVolume: number;
  initialMuted: boolean;
  initialElapsedSeconds?: number;
  initialDurationSeconds?: number;
  initialPositionUpdatedAt?: string;
}

function isFailedArtworkCandidate(
  candidate: string | null | undefined,
  failedArtworkUrl: string | null
) {
  return Boolean(candidate) && candidate === failedArtworkUrl;
}

export function useMediaCardController({
  entityId,
  entityPicture,
  artworkKey,
  initialState,
  initialVolume,
  initialMuted,
  initialElapsedSeconds,
  initialDurationSeconds,
  initialPositionUpdatedAt,
}: UseMediaCardControllerParams) {
  const { config: authConfig } = useAuth();
  const connected = useHomeAssistant(homeAssistantSelectors.connected);
  const connection = useHomeAssistant(homeAssistantSelectors.connection);
  const { t } = useI18n();
  const [state, setState] = useState(initialState);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isOpen, setIsOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(initialElapsedSeconds ?? 0);
  const [durationSeconds, setDurationSeconds] = useState(initialDurationSeconds ?? 0);
  const [failedArtworkUrl, setFailedArtworkUrl] = useState<string | null>(null);
  const [resolvedAlbumArt, setResolvedAlbumArt] = useState<string | null>(null);
  const [thumbnailAlbumArt, setThumbnailAlbumArt] = useState<string | null>(null);
  const artworkRequestKey = [entityId, artworkKey].filter(Boolean).join('::');
  const fallbackArtwork = entityPicture
    ? import.meta.env.DEV
      ? resolveHomeAssistantProxyUrl(entityPicture, authConfig?.url)
      : resolveHomeAssistantAbsoluteUrl(entityPicture, authConfig?.url)
    : null;

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  useEffect(() => {
    setVolume(initialVolume);
  }, [initialVolume]);

  useEffect(() => {
    setIsMuted(initialMuted);
  }, [initialMuted]);

  useEffect(() => {
    setElapsedSeconds(initialElapsedSeconds ?? 0);
  }, [initialElapsedSeconds]);

  useEffect(() => {
    setDurationSeconds(initialDurationSeconds ?? 0);
  }, [initialDurationSeconds]);

  useEffect(() => {
    if (!artworkRequestKey) {
      setThumbnailAlbumArt(null);
      setResolvedAlbumArt(
        isFailedArtworkCandidate(fallbackArtwork, failedArtworkUrl) ? null : fallbackArtwork
      );
      return;
    }

    let cancelled = false;

    void (async () => {
      if (!connected || !connection) {
        if (!cancelled) {
          setResolvedAlbumArt(
            isFailedArtworkCandidate(fallbackArtwork, failedArtworkUrl) ? null : fallbackArtwork
          );
        }
        return;
      }

      const thumbnailDataUrl = await fetchMediaThumbnailDataUrl(entityId, connection).catch(
        () => null
      );
      if (thumbnailDataUrl && !isFailedArtworkCandidate(thumbnailDataUrl, failedArtworkUrl)) {
        if (cancelled) {
          return;
        }

        setThumbnailAlbumArt(thumbnailDataUrl);
        setResolvedAlbumArt(thumbnailDataUrl);
        return;
      }

      if (!cancelled) {
        setThumbnailAlbumArt(null);
        setResolvedAlbumArt(
          isFailedArtworkCandidate(fallbackArtwork, failedArtworkUrl) ? null : fallbackArtwork
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [artworkRequestKey, connected, connection, entityId, failedArtworkUrl, fallbackArtwork]);

  useEffect(() => {
    if (!artworkRequestKey) {
      return;
    }

    setFailedArtworkUrl(null);
    setThumbnailAlbumArt(null);
  }, [artworkRequestKey]);

  const isPlaying = state === 'playing';

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const getBaseElapsed = () => {
      if (!initialPositionUpdatedAt) {
        return initialElapsedSeconds ?? 0;
      }

      const updatedAtMs = Date.parse(initialPositionUpdatedAt);
      if (Number.isNaN(updatedAtMs)) {
        return initialElapsedSeconds ?? 0;
      }

      const driftSeconds = Math.max(0, Math.floor((Date.now() - updatedAtMs) / 1000));
      return (initialElapsedSeconds ?? 0) + driftSeconds;
    };

    const syncElapsed = () => {
      const nextElapsed = Math.min(
        durationSeconds || Number.POSITIVE_INFINITY,
        Math.max(0, getBaseElapsed())
      );
      setElapsedSeconds(nextElapsed);
    };

    syncElapsed();
    const timerId = window.setInterval(syncElapsed, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [durationSeconds, initialElapsedSeconds, initialPositionUpdatedAt, isPlaying]);

  const runAction = useCallback(async (action: () => Promise<void>, errorMessage: string) => {
    try {
      await action();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : errorMessage);
    }
  }, []);

  const togglePlay = useCallback(() => {
    const nextState = isPlaying ? 'paused' : 'playing';
    setState(nextState);
    void runAction(
      () => homeAssistantService.updateMediaPlayerPlayback(entityId, isPlaying ? 'pause' : 'play'),
      t('media.feedback.updatePlaybackFailed')
    );
  }, [entityId, isPlaying, runAction, t]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    void runAction(
      () => homeAssistantService.setMediaPlayerMute(entityId, nextMuted),
      t('media.feedback.updateVolumeFailed')
    );
  }, [entityId, isMuted, runAction, t]);

  const handleVolumeChange = useCallback(
    (nextVolume: number) => {
      setVolume(nextVolume);
      if (nextVolume > 0 && isMuted) {
        setIsMuted(false);
        void runAction(async () => {
          await homeAssistantService.setMediaPlayerMute(entityId, false);
          await homeAssistantService.setMediaPlayerVolume(entityId, nextVolume);
        }, t('media.feedback.updateVolumeFailed'));
        return;
      }

      void runAction(
        () => homeAssistantService.setMediaPlayerVolume(entityId, nextVolume),
        t('media.feedback.updateVolumeFailed')
      );
    },
    [entityId, isMuted, runAction, t]
  );

  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const handlePrevious = useCallback(() => {
    void runAction(
      () => homeAssistantService.updateMediaPlayerPlayback(entityId, 'previous'),
      t('media.feedback.previousTrackFailed')
    );
  }, [entityId, runAction, t]);

  const handleNext = useCallback(() => {
    void runAction(
      () => homeAssistantService.updateMediaPlayerPlayback(entityId, 'next'),
      t('media.feedback.nextTrackFailed')
    );
  }, [entityId, runAction, t]);

  const handleArtworkError = useCallback((imageUrl?: string | null) => {
    if (!imageUrl) {
      return;
    }

    setResolvedAlbumArt((current) => (current === imageUrl ? null : current));
    setFailedArtworkUrl((current) => current ?? imageUrl);
  }, []);

  return {
    albumArt: resolvedAlbumArt,
    thumbnailAlbumArt,
    closeDialog,
    durationSeconds,
    elapsedSeconds,
    handleArtworkError,
    handleNext,
    handlePrevious,
    handleVolumeChange,
    isOff: state === 'off',
    isMuted,
    isOpen,
    isPlaying,
    openDialog,
    toggleMute,
    togglePlay,
    volume,
  };
}
