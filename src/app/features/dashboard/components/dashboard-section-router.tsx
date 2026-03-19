import { Lightbulb } from 'lucide-react';
import { lazy, type ReactNode, Suspense } from 'react';
import { RoomNav } from '@/app/components/layout/room-nav';
import { EmptyState } from '@/app/components/shared/empty-state';
import { LoadingSpinner } from '@/app/components/shared/loading-spinner';
import { RenderProfiler } from '@/app/components/shared/render-profiler';
import { EnergySection } from '@/app/features/energy';
import { useI18n } from '@/app/hooks';
import { AllViewGrid } from '../all-view-grid';
import { DeviceGrid } from '../device-grid';
import type { DashboardController } from '../hooks/use-dashboard-controller';
import { DashboardLayout } from '../shell';
import { AllDashboardOrganizer } from './all-dashboard-organizer';
import { HomeDashboardOverview } from './home-dashboard-overview';

const lazySections = () => import('@/app/components/layout/sections');

const SecuritySection = lazy(() => lazySections().then((m) => ({ default: m.SecuritySection })));
const TasksSection = lazy(() => lazySections().then((m) => ({ default: m.TasksSection })));
const LocksSection = lazy(() => lazySections().then((m) => ({ default: m.LocksSection })));
const MediaSection = lazy(() => lazySections().then((m) => ({ default: m.MediaSection })));
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
    allCustomCards,
    allViewGrouping,
    cardOrders,
    cardSizes,
    changeRoom,
    customCards,
    deviceMap,
    handleAddCard,
    handleDeleteCard,
    handleRemoveEntity,
    handleUpdateCard,
    hiddenEntityIds,
    isEditMode,
    lightDeviceMap,
    lightRooms,
    onSetAllViewGrouping,
    onOpenAddCardDialog,
    onOpenAddEntityDialog,
    onToggleEditMode,
    orderedCardIds,
    rooms,
    updateCardSize,
  } = controller;
  const sectionStackProps = {
    className: 'flex flex-col gap-2 md:gap-6',
  };

  let sectionContent: ReactNode;

  if (activeSection === 'security') {
    sectionContent = (
      <Suspense fallback={<LoadingSpinner />}>
        <SecuritySection />
      </Suspense>
    );
  } else if (activeSection === 'energy') {
    sectionContent = (
      <RenderProfiler id="EnergySection">
        <EnergySection />
      </RenderProfiler>
    );
  } else if (activeSection === 'tasks') {
    sectionContent = (
      <Suspense fallback={<LoadingSpinner />}>
        <TasksSection />
      </Suspense>
    );
  } else if (activeSection === 'locks') {
    sectionContent = (
      <Suspense fallback={<LoadingSpinner />}>
        <LocksSection />
      </Suspense>
    );
  } else if (activeSection === 'lights') {
    sectionContent = (
      <div {...sectionStackProps}>
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
    );
  } else if (activeSection === 'media') {
    sectionContent = (
      <Suspense fallback={<LoadingSpinner />}>
        <MediaSection />
      </Suspense>
    );
  } else if (activeSection === 'mock') {
    sectionContent = (
      <RenderProfiler id="DashboardBuilder">
        <AllDashboardOrganizer
          deviceMap={deviceMap}
          rooms={rooms}
          cardOrders={cardOrders}
          isEditMode={isEditMode}
          cardSizes={cardSizes}
          updateCardSize={updateCardSize}
          grouping={allViewGrouping}
          customCards={allCustomCards}
          hiddenEntityCount={hiddenEntityIds.length}
          onDeleteCard={handleDeleteCard}
          onUpdateCard={handleUpdateCard}
          onRemoveEntity={handleRemoveEntity}
          allowEntityRemoval
          usesHideAction
          onOpenAddCardDialog={onOpenAddCardDialog}
          onOpenAddEntityDialog={addableEntityIds.length > 0 ? onOpenAddEntityDialog : undefined}
          onQuickAddCard={handleAddCard}
          onToggleEditMode={onToggleEditMode}
          onGroupingChange={onSetAllViewGrouping}
        />
      </RenderProfiler>
    );
  } else if (activeSection === 'settings') {
    sectionContent = (
      <Suspense fallback={<LoadingSpinner message={t('dashboard.shell.loadingSettings')} />}>
        <RenderProfiler id="SettingsSection">
          <SettingsSection />
        </RenderProfiler>
      </Suspense>
    );
  } else {
    sectionContent = (
      <div {...sectionStackProps}>
        <RoomNav
          rooms={rooms}
          activeRoom={activeRoom}
          onRoomChange={changeRoom}
          allViewGrouping={allViewGrouping}
          isEditMode={isEditMode}
          onAllViewGroupingChange={onSetAllViewGrouping}
          onToggleEditMode={onToggleEditMode}
          onAddCard={onOpenAddCardDialog}
          onAddEntity={addableEntityIds.length > 0 ? onOpenAddEntityDialog : undefined}
          addEntityLabel={t('dashboard.addEntity.title')}
        />

        {activeRoom === 'All' ? (
          <RenderProfiler id="HomeDashboardOverview">
            <HomeDashboardOverview
              deviceMap={deviceMap}
              cardSizes={cardSizes}
              updateCardSize={updateCardSize}
              isEditMode={isEditMode}
              hiddenEntityCount={hiddenEntityIds.length}
              allCustomCards={controller.allCustomCards}
              cardZones={controller.cardZones}
              updateCardZone={controller.updateCardZone}
              onOpenAddEntityDialog={
                addableEntityIds.length > 0 ? onOpenAddEntityDialog : undefined
              }
              onOpenBuilder={() => controller.setActiveSection('mock')}
              onDeleteCard={handleDeleteCard}
              onUpdateCard={handleUpdateCard}
              setActiveSection={controller.setActiveSection}
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
      </div>
    );
  }

  const dashboardContent = <DashboardLayout>{sectionContent}</DashboardLayout>;

  if (activeSection === 'settings') {
    return dashboardContent;
  }

  if (
    activeSection === 'security' ||
    activeSection === 'energy' ||
    activeSection === 'tasks' ||
    activeSection === 'locks' ||
    activeSection === 'lights' ||
    activeSection === 'media' ||
    activeSection === 'mock'
  ) {
    return dashboardContent;
  }

  return dashboardContent;
}
