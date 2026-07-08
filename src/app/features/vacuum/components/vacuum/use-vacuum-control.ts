import { useState } from 'react';
import type { VacuumStatus } from './vacuum-utils';

interface UseVacuumControlProps {
  initialStatus: VacuumStatus;
}

interface UseVacuumControlReturn {
  currentStatus: VacuumStatus;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  handleStartCleaning: () => void;
  handlePause: () => void;
  handleReturnHome: () => void;
}

export function useVacuumControl({ initialStatus }: UseVacuumControlProps): UseVacuumControlReturn {
  // Status is derived from the HA entity prop — no local simulation needed.
  // The parent card receives initialStatus from the HA store and re-renders when it changes.
  const currentStatus = initialStatus;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStartCleaning = () => {};
  const handlePause = () => {};
  const handleReturnHome = () => {};

  return {
    currentStatus,
    isDialogOpen,
    setIsDialogOpen,
    handleStartCleaning,
    handlePause,
    handleReturnHome,
  };
}
