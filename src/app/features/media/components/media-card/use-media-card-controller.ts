import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/auth-context';
import { useI18n } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';

interface UseMediaCardControllerParams {
  entityId: string;
  entityPicture?: string;
  initialState: 'playing' | 'paused' | 'idle' | 'off';
  initialVolume: number;
  initialMuted: boolean;
  initialElapsedSeconds?: number;
  initialDurationSeconds?: number;
  initialPositionUpdatedAt?: string;
}

function normalizeMediaArtworkUrl(entityPicture: string, hassUrl?: string) {
  if (!entityPicture) {
    return null;
  }

  if (entityPicture.startsWith('/api/')) {
    return entityPicture;
  }

  if (!entityPicture.startsWith('http://') && !entityPicture.startsWith('https://')) {
    return hassUrl ? `${hassUrl}${entityPicture}` : entityPicture;
  }

  if (!hassUrl) {
    return entityPicture;
  }

  try {
    const resolvedArtworkUrl = new URL(entityPicture);
    const resolvedHassUrl = new URL(hassUrl);

    if (
      resolvedArtworkUrl.origin === resolvedHassUrl.origin &&
      resolvedArtworkUrl.pathname.startsWith('/api/')
    ) {
      return `${resolvedArtworkUrl.pathname}${resolvedArtworkUrl.search}`;
    }
  } catch {
    return entityPicture;
  }

  return entityPicture;
}

export function useMediaCardController({
  entityId,
  entityPicture,
  initialState,
  initialVolume,
  initialMuted,
  initialElapsedSeconds,
  initialDurationSeconds,
  initialPositionUpdatedAt,
}: UseMediaCardControllerParams) {
  const { config: authConfig } = useAuth();
  const { t } = useI18n();
  const [state, setState] = useState(initialState);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isOpen, setIsOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(initialElapsedSeconds ?? 0);
  const [durationSeconds, setDurationSeconds] = useState(initialDurationSeconds ?? 0);
  const [failedArtworkUrl, setFailedArtworkUrl] = useState<string | null>(null);
  const previousEntityPictureRef = useRef(entityPicture);

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

  const albumArt = useMemo(() => {
    if (!entityPicture) {
      return null;
    }

    const normalizedArtworkUrl = normalizeMediaArtworkUrl(entityPicture, authConfig?.url);
    if (!normalizedArtworkUrl || normalizedArtworkUrl === failedArtworkUrl) {
      return null;
    }

    return normalizedArtworkUrl;
  }, [authConfig, entityPicture, failedArtworkUrl]);

  useEffect(() => {
    if (previousEntityPictureRef.current !== entityPicture) {
      previousEntityPictureRef.current = entityPicture;
      setFailedArtworkUrl(null);
    }
  });

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

    setFailedArtworkUrl((current) => current ?? imageUrl);
  }, []);

  return {
    albumArt,
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
