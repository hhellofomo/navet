import type { DashboardController } from '../hooks/use-dashboard-controller';
import { AddCardDialogContainer } from './add-card-dialog';
import { AddEntityDialog } from './add-entity-dialog';
import { DashboardOnboardingDialog } from './dashboard-onboarding-dialog';

interface DashboardOverlaysProps {
  controller: DashboardController;
}

export function DashboardOverlays({ controller }: DashboardOverlaysProps) {
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
          title="Add Entity"
          description={
            hiddenEntityIds.length > 0
              ? 'Add Home Assistant entities back to the dashboard.'
              : 'Choose Home Assistant entities to add to the dashboard.'
          }
          actionLabel="Add"
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
