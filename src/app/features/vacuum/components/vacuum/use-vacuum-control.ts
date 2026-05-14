import { useCallback, useState } from 'react';
import { useI18n, useServiceActionHandler } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import type { VacuumStatus } from './vacuum-utils';

interface UseVacuumControlProps {
  entityId: string;
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

export function useVacuumControl({
  entityId,
  initialStatus,
}: UseVacuumControlProps): UseVacuumControlReturn {
  // Status is derived from the HA entity prop — no local simulation needed.
  // The parent card receives initialStatus from the HA store and re-renders when it changes.
  const currentStatus = initialStatus;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const runAction = useServiceActionHandler();
  const { t } = useI18n();

  const handleStartCleaning = useCallback(() => {
    void runAction(
      () => homeAssistantService.callService('vacuum', 'start', {}, { entity_id: entityId }),
      t('vacuum.feedback.startFailed')
    );
  }, [entityId, runAction, t]);

  const handlePause = useCallback(() => {
    void runAction(
      () => homeAssistantService.callService('vacuum', 'pause', {}, { entity_id: entityId }),
      t('vacuum.feedback.pauseFailed')
    );
  }, [entityId, runAction, t]);

  const handleReturnHome = useCallback(() => {
    void runAction(
      () =>
        homeAssistantService.callService('vacuum', 'return_to_base', {}, { entity_id: entityId }),
      t('vacuum.feedback.returnFailed')
    );
  }, [entityId, runAction, t]);

  return {
    currentStatus,
    isDialogOpen,
    setIsDialogOpen,
    handleStartCleaning,
    handlePause,
    handleReturnHome,
  };
}
