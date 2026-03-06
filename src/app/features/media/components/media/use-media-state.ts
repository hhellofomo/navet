import { useCallback, useState } from 'react';

interface UseMediaStateProps {
  initialVolume?: number;
}

export function useMediaState({ initialVolume = 70 }: UseMediaStateProps = {}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handlePrevious = useCallback(() => {
    // Previous track logic would go here
  }, []);

  const handleNext = useCallback(() => {
    // Next track logic would go here
  }, []);

  return {
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
  };
}
