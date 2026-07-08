import { closestCenter, DndContext } from '@dnd-kit/core';
import { Lightbulb } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { RoomNav } from '@/app/components/layout/room-nav';
import {
  LocksSection,
  MediaSection,
  MockEntitiesSection,
  SecuritySection,
  TasksSection,
} from '@/app/components/layout/sections';
import { EmptyState } from '@/app/components/shared/empty-state';
import { LoadingSpinner } from '@/app/components/shared/loading-spinner';
import { RenderProfiler } from '@/app/components/shared/render-profiler';
import { useI18n } from '@/app/hooks';
import { AllViewGrid } from '../all-view-grid';
import { DeviceGrid } from '../device-grid';
import type { DashboardController } from '../hooks/use-dashboard-controller';
import { useDashboardEditModeLongPress } from '../hooks/use-dashboard-edit-mode-long-press';
import { DashboardLayout } from '../shell';

const SettingsSection = lazy(async () => {
  const module = await import('@/app/features/settings');
  return { default: module.SettingsSection };
});

interface DashboardSectionRouterProps {
  controller: DashboardController;
}

export function DashboardSectionRouter({ controller }: DashboardSectionRouterProps) {
  const { t } = useI18n();
  const {
    activeRoom,
    activeSection,
    addableEntityIds,
    allViewGrouping,
    cardOrders,
    cardSizes,
    changeRoom,
    customCards,
    deviceMap,
    handleDeleteCard,
    handleDragEnd,
    handleDragOver,
    handleRemoveEntity,
    handleUpdateCard,
    hiddenEntityIds,
    isEditMode,
    lightDeviceMap,
    lightRooms,
    onEnterEditMode,
    onMoveRoom,
    onSetAllViewGrouping,
    onOpenAddCardDialog,
    onOpenAddEntityDialog,
    onToggleEditMode,
    orderedCardIds,
    roomOrder,
    sensors,
    updateCardSize,
  } = controller;
  const editModeLongPressProps = useDashboardEditModeLongPress({
    disabled: isEditMode,
    onLongPress: onEnterEditMode,
  });

  if (activeSection === 'security') {
    return (
      <DashboardLayout>
        <SecuritySection />
      </DashboardLayout>
    );
  }

  if (activeSection === 'tasks') {
    return (
      <DashboardLayout>
        <TasksSection />
      </DashboardLayout>
    );
  }

  if (activeSection === 'locks') {
    return (
      <DashboardLayout>
        <LocksSection />
      </DashboardLayout>
    );
  }

  if (activeSection === 'lights') {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 md:gap-8" {...editModeLongPressProps}>
          {lightDeviceMap.size > 0 ? (
            <RenderProfiler id="LightsSection">
              <AllViewGrid
                deviceMap={lightDeviceMap}
                rooms={lightRooms}
                cardOrders={cardOrders}
                isEditMode={isEditMode}
                cardSizes={cardSizes}
                grouping="custom"
                updateCardSize={updateCardSize}
              />
            </RenderProfiler>
          ) : (
            <EmptyState
              icon={Lightbulb}
              title={t('dashboard.shell.noLightsTitle')}
              description={
                hiddenEntityIds.length > 0
                  ? t('dashboard.shell.noLightsHidden')
                  : t('dashboard.shell.noLightsEmpty')
              }
              actionIcon={Lightbulb}
              actionLabel={hiddenEntityIds.length > 0 ? t('dashboard.addEntity.title') : undefined}
              onAction={hiddenEntityIds.length > 0 ? onOpenAddEntityDialog : undefined}
            />
          )}
        </div>
      </DashboardLayout>
    );
  }

  if (activeSection === 'media') {
    return (
      <DashboardLayout>
        <MediaSection />
      </DashboardLayout>
    );
  }

  if (activeSection === 'mock') {
    return (
      <DashboardLayout>
        <MockEntitiesSection />
      </DashboardLayout>
    );
  }

  if (activeSection === 'settings') {
    return (
      <DashboardLayout>
        <Suspense fallback={<LoadingSpinner message={t('dashboard.shell.loadingSettings')} />}>
          <RenderProfiler id="SettingsSection">
            <SettingsSection />
          </RenderProfiler>
        </Suspense>
      </DashboardLayout>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <DashboardLayout>
        <div className="flex flex-col gap-6 md:gap-8" {...editModeLongPressProps}>
          <RoomNav
            rooms={roomOrder}
            activeRoom={activeRoom}
            onRoomChange={changeRoom}
            allViewGrouping={allViewGrouping}
            isEditMode={isEditMode}
            onAllViewGroupingChange={onSetAllViewGrouping}
            onToggleEditMode={onToggleEditMode}
            onMoveRoom={onMoveRoom}
            onAddCard={onOpenAddCardDialog}
            onAddEntity={addableEntityIds.length > 0 ? onOpenAddEntityDialog : undefined}
            addEntityLabel={t('dashboard.addEntity.title')}
          />

          {activeRoom === 'All' ? (
            <RenderProfiler id="AllViewGrid">
              <AllViewGrid
                deviceMap={deviceMap}
                rooms={roomOrder}
                cardOrders={cardOrders}
                isEditMode={isEditMode}
                cardSizes={cardSizes}
                grouping={allViewGrouping}
                updateCardSize={updateCardSize}
                customCards={customCards}
                onDeleteCard={handleDeleteCard}
                onUpdateCard={handleUpdateCard}
                onRemoveEntity={handleRemoveEntity}
                allowEntityRemoval
                usesHideAction
              />
            </RenderProfiler>
          ) : (
            <RenderProfiler id={`DeviceGrid:${activeRoom}`}>
              <DeviceGrid
                orderedCardIds={orderedCardIds}
                deviceMap={deviceMap}
                isEditMode={isEditMode}
                cardSizes={cardSizes}
                updateCardSize={updateCardSize}
                customCards={customCards}
                onDeleteCard={handleDeleteCard}
                onUpdateCard={handleUpdateCard}
                onRemoveEntity={handleRemoveEntity}
                allowEntityRemoval
                usesHideAction
              />
            </RenderProfiler>
          )}

          {deviceMap.size === 0 && customCards.length === 0 && activeRoom === 'All' && (
            <EmptyState
              icon={Lightbulb}
              title={t('dashboard.shell.noVisibleEntitiesTitle')}
              description={t('dashboard.shell.noVisibleEntitiesDescription')}
              actionIcon={Lightbulb}
              actionLabel={addableEntityIds.length > 0 ? t('dashboard.addEntity.title') : undefined}
              onAction={addableEntityIds.length > 0 ? onOpenAddEntityDialog : undefined}
            />
          )}
        </div>
      </DashboardLayout>
    </DndContext>
  );
}
