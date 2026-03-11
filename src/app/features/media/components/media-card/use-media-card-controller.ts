import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/auth-context';
import { homeAssistantService } from '@/app/services/home-assistant.service';

interface UseMediaCardControllerParams {
  entityId: string;
  entityPicture?: string;
  initialState: 'playing' | 'paused' | 'idle' | 'off';
  initialVolume: number;
  initialMuted: boolean;
}

export function useMediaCardController({
  entityId,
  entityPicture,
  initialState,
  initialVolume,
  initialMuted,
}: UseMediaCardControllerParams) {
  const { config: authConfig } = useAuth();
  const [state, setState] = useState(initialState);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  useEffect(() => {
    setVolume(initialVolume);
  }, [initialVolume]);

  useEffect(() => {
    setIsMuted(initialMuted);
  }, [initialMuted]);

  const albumArt = useMemo(() => {
    if (!entityPicture) {
      return null;
    }

    if (entityPicture.startsWith('http://') || entityPicture.startsWith('https://')) {
      return entityPicture;
    }

    return authConfig ? `${authConfig.url}${entityPicture}` : entityPicture;
  }, [authConfig, entityPicture]);

  const isPlaying = state === 'playing';

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
      'Failed to update media playback'
    );
  }, [entityId, isPlaying, runAction]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    void runAction(
      () => homeAssistantService.setMediaPlayerMute(entityId, nextMuted),
      'Failed to update media volume'
    );
  }, [entityId, isMuted, runAction]);

  const handleVolumeChange = useCallback(
    (nextVolume: number) => {
      setVolume(nextVolume);
      if (nextVolume > 0 && isMuted) {
        setIsMuted(false);
        void runAction(async () => {
          await homeAssistantService.setMediaPlayerMute(entityId, false);
          await homeAssistantService.setMediaPlayerVolume(entityId, nextVolume);
        }, 'Failed to update media volume');
        return;
      }

      void runAction(
        () => homeAssistantService.setMediaPlayerVolume(entityId, nextVolume),
        'Failed to update media volume'
      );
    },
    [entityId, isMuted, runAction]
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
      'Failed to skip to previous track'
    );
  }, [entityId, runAction]);

  const handleNext = useCallback(() => {
    void runAction(
      () => homeAssistantService.updateMediaPlayerPlayback(entityId, 'next'),
      'Failed to skip to next track'
    );
  }, [entityId, runAction]);

  return {
    albumArt,
    closeDialog,
    handleNext,
    handlePrevious,
    handleVolumeChange,
    isMuted,
    isOpen,
    isPlaying,
    openDialog,
    toggleMute,
    togglePlay,
    volume,
  };
}
