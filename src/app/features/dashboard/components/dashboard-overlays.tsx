import { useI18n } from '@/app/hooks';
import type { DashboardController } from '../hooks/use-dashboard-controller';
import { AddCardDialogContainer } from './add-card-dialog';
import { AddEntityDialog } from './add-entity-dialog';
import { DashboardOnboardingDialog } from './dashboard-onboarding-dialog';

interface DashboardOverlaysProps {
  controller: DashboardController;
}

export function DashboardOverlays({ controller }: DashboardOverlaysProps) {
  const { t } = useI18n();
  const {
    activeRoom,
    addableEntityIds,
    allEntityIds,
    availableDeviceMap,
    handleAddCard,
    handleAddEntity,
    handleChooseAllEntities,
    handleChooseBlankDashboard,
    handleOnboardingImportDashboardConfig,
    hiddenEntityIds,
    isOnboardingClosing,
    onboardingCompleted,
    onCompleteOnboardingClose,
    onCloseAddCardDialog,
    onCloseAddEntityDialog,
    showAddCardDialog,
    showAddEntityDialog,
  } = controller;

  return (
    <>
      {showAddCardDialog && (
        <AddCardDialogContainer
          open={showAddCardDialog}
          onClose={onCloseAddCardDialog}
          onAddCard={handleAddCard}
          currentRoom={activeRoom}
        />
      )}

      {showAddEntityDialog && (
        <AddEntityDialog
          open={showAddEntityDialog}
          onClose={onCloseAddEntityDialog}
          onAddEntity={handleAddEntity}
          currentRoom={activeRoom}
          deviceMap={availableDeviceMap}
          addedEntityIds={[]}
          visibleEntityIds={addableEntityIds}
          title={t('dashboard.addEntity.title')}
          description={
            hiddenEntityIds.length > 0
              ? t('dashboard.addEntity.descriptionWithHidden')
              : t('dashboard.addEntity.descriptionDefault')
          }
          actionLabel={t('dashboard.addEntity.action')}
        />
      )}

      {(!onboardingCompleted || isOnboardingClosing) && allEntityIds.length > 0 && (
        <DashboardOnboardingDialog
          open
          onChooseAll={handleChooseAllEntities}
          onChooseBlank={handleChooseBlankDashboard}
          onImportConfig={handleOnboardingImportDashboardConfig}
          phase={isOnboardingClosing ? 'closing' : 'idle'}
          onClosingAnimationComplete={onCompleteOnboardingClose}
        />
      )}
    </>
  );
}
