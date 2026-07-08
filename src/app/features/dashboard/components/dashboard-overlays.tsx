import { lazy, Suspense } from 'react';
import type { DashboardController } from '../hooks/use-dashboard-controller';
import { AddEntityDialog } from './add-entity-dialog';

const AddCardDialog = lazy(async () => {
  const module = await import('./AddCardDialogContainer');
  return { default: module.AddCardDialogContainer };
});

const DashboardOnboardingDialog = lazy(async () => {
  const module = await import('./dashboard-onboarding-dialog');
  return { default: module.DashboardOnboardingDialog };
});

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
    handleImportDashboardConfig,
    hiddenEntityIds,
    onboardingCompleted,
    onCloseAddCardDialog,
    onCloseAddEntityDialog,
    showAddCardDialog,
    showAddEntityDialog,
  } = controller;

  return (
    <>
      {showAddCardDialog && (
        <Suspense fallback={null}>
          <AddCardDialog
            open={showAddCardDialog}
            onClose={onCloseAddCardDialog}
            onAddCard={handleAddCard}
            currentRoom={activeRoom}
          />
        </Suspense>
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

      {!onboardingCompleted && allEntityIds.length > 0 && (
        <Suspense fallback={null}>
          <DashboardOnboardingDialog
            open
            onChooseAll={handleChooseAllEntities}
            onChooseBlank={handleChooseBlankDashboard}
            onImportConfig={handleImportDashboardConfig}
          />
        </Suspense>
      )}
    </>
  );
}
