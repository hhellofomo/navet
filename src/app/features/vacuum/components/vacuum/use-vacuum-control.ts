import { useState } from 'react';

type VacuumStatus = 'cleaning' | 'returning' | 'docked' | 'paused' | 'idle';

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
  const [currentStatus, setCurrentStatus] = useState<VacuumStatus>(initialStatus);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStartCleaning = () => {
    setCurrentStatus('cleaning');
  };

  const handlePause = () => {
    setCurrentStatus(currentStatus === 'cleaning' ? 'paused' : 'cleaning');
  };

  const handleReturnHome = () => {
    setCurrentStatus('returning');
    // Simulate returning home
    setTimeout(() => {
      setCurrentStatus('docked');
    }, 3000);
  };

  return {
    currentStatus,
    isDialogOpen,
    setIsDialogOpen,
    handleStartCleaning,
    handlePause,
    handleReturnHome,
  };
}
