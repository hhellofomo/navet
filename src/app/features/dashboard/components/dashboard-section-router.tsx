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
import { AllViewGrid } from '../all-view-grid';
import { DashboardLayout } from '../dashboard-layout';
import { DeviceGrid } from '../device-grid';
import type { DashboardController } from '../hooks/use-dashboard-controller';

const SettingsSection = lazy(async () => {
  const module = await import('@/app/features/settings');
  return { default: module.SettingsSection };
});

interface DashboardSectionRouterProps {
  controller: DashboardController;
}

export function DashboardSectionRouter({ controller }: DashboardSectionRouterProps) {
  const {
    activeRoom,
    activeSection,
    addableEntityIds,
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
    onMoveRoom,
    onOpenAddCardDialog,
    onOpenAddEntityDialog,
    onToggleEditMode,
    orderedCardIds,
    roomOrder,
    sensors,
    updateCardSize,
  } = controller;

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
        {lightDeviceMap.size > 0 ? (
          <RenderProfiler id="LightsSection">
            <AllViewGrid
              deviceMap={lightDeviceMap}
              rooms={lightRooms}
              cardOrders={cardOrders}
              isEditMode={isEditMode}
              cardSizes={cardSizes}
              updateCardSize={updateCardSize}
            />
          </RenderProfiler>
        ) : (
          <EmptyState
            icon={Lightbulb}
            title="No Lights"
            description={
              hiddenEntityIds.length > 0
                ? 'All light entities have been removed from the dashboard.'
                : 'No Home Assistant light entities are currently available.'
            }
            actionIcon={Lightbulb}
            actionLabel={hiddenEntityIds.length > 0 ? 'Add Entity' : undefined}
            onAction={hiddenEntityIds.length > 0 ? onOpenAddEntityDialog : undefined}
          />
        )}
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
        <Suspense fallback={<LoadingSpinner message="Loading settings..." />}>
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
        <RoomNav
          rooms={roomOrder}
          activeRoom={activeRoom}
          onRoomChange={changeRoom}
          isEditMode={isEditMode}
          onToggleEditMode={onToggleEditMode}
          onMoveRoom={onMoveRoom}
          onAddCard={onOpenAddCardDialog}
          onAddEntity={addableEntityIds.length > 0 ? onOpenAddEntityDialog : undefined}
          addEntityLabel="Add Entity"
        />

        {activeRoom === 'All' ? (
          <RenderProfiler id="AllViewGrid">
            <AllViewGrid
              deviceMap={deviceMap}
              rooms={roomOrder}
              cardOrders={cardOrders}
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
            title="No Visible Entities"
            description="Your dashboard is empty. Add entities from your hidden list or add custom cards to start building it."
            actionIcon={Lightbulb}
            actionLabel={addableEntityIds.length > 0 ? 'Add Entity' : undefined}
            onAction={addableEntityIds.length > 0 ? onOpenAddEntityDialog : undefined}
          />
        )}
      </DashboardLayout>
    </DndContext>
  );
}
