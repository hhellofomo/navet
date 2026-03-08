import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Lightbulb } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { RoomNav } from './components/layout/room-nav';
import {
  LocksSection,
  MediaSection,
  SecuritySection,
  TasksSection,
} from './components/layout/sections';
import type { CardSize } from './components/shared/card-size-selector';
import { EmptyState } from './components/shared/empty-state';
import { LoadingSpinner } from './components/shared/loading-spinner';
import { RenderProfiler } from './components/shared/render-profiler';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { ConfigProvider, useConfig } from './contexts/config-context';
import { ErrorProvider } from './contexts/error-context';
import { LoadingProvider } from './contexts/loading-context';
import { LoginPage } from './features/auth/login-page';
import { AllViewGrid } from './features/dashboard/all-view-grid';
import type { CardType } from './features/dashboard/components/AddCardDialogContainer';
import { DashboardLayout } from './features/dashboard/dashboard-layout';
import { DeviceGrid } from './features/dashboard/device-grid';
import {
  useCardOrdering,
  useCardState,
  useDashboardDevices,
  useDeviceMap,
  useEditMode,
  useHomeAssistant,
  useNavigation,
  useRoomNavigation,
  useRoomOrdering,
} from './hooks';
import { useCustomCards } from './hooks/use-custom-cards';
import { useDevices, useRooms } from './hooks/use-devices';
import { useDashboardEntitiesStore, useSettingsStore } from './stores';
import { getDeviceRoom, getDeviceRoomLabel } from './utils/device-location';

const AddCardDialog = lazy(async () => {
  const module = await import('./features/dashboard/components/AddCardDialogContainer');
  return { default: module.AddCardDialogContainer };
});

const AddEntityDialog = lazy(async () => {
  const module = await import('./features/dashboard/components/add-entity-dialog');
  return { default: module.AddEntityDialog };
});

const SettingsSection = lazy(async () => {
  const module = await import('./features/settings/components/settings-section');
  return { default: module.SettingsSection };
});

/**
 * Dashboard Component
 * The main dashboard view after authentication
 */
function Dashboard() {
  const { activeSection } = useNavigation();
  const { connected, connecting, error } = useHomeAssistant();
  const [devicesLoaded, setDevicesLoaded] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const dashboardMode = useDashboardEntitiesStore((state) => state.mode);
  const manualEntityIds = useDashboardEntitiesStore((state) => state.manualEntityIds);
  const addManualEntity = useDashboardEntitiesStore((state) => state.addEntity);
  const removeManualEntity = useDashboardEntitiesStore((state) => state.removeEntity);

  // Fetch devices with Home Assistant lights and existing fallback behavior for other types
  const allDevices = useDevices();
  const devices = useDashboardDevices(allDevices, dashboardMode, manualEntityIds);
  const rooms = useRooms(devices);

  // Set devices loaded when connected or when mock devices are ready
  useEffect(() => {
    if (connected || !connecting) {
      setDevicesLoaded(true);
    }
  }, [connected, connecting]);

  // Custom hooks for state management
  const { activeRoom, changeRoom } = useRoomNavigation('All'); // Default to All view
  const { addCard, removeCard, updateCard, getCardsForRoom } = useCustomCards();
  const allCustomCards = getCardsForRoom('All');
  const { isEditMode, toggleEditMode } = useEditMode();
  const { cardSizes, updateCardSize } = useCardState(devices);
  const { cardOrders, moveCard } = useCardOrdering(devices, rooms, allCustomCards);
  const { roomOrder, moveRoom } = useRoomOrdering(rooms);
  const { deviceMap } = useDeviceMap(devices);
  const { deviceMap: availableDeviceMap } = useDeviceMap(allDevices);
  const lightDeviceMap = useMemo(
    () => new Map(Array.from(deviceMap.entries()).filter(([, device]) => device.type === 'lights')),
    [deviceMap]
  );
  const getCardRoom = useCallback(
    (cardId: string) => {
      const device = deviceMap.get(cardId);
      if (device) {
        return getDeviceRoomLabel(device);
      }

      const customCard = allCustomCards.find((card) => card.id === cardId);
      return customCard?.room ?? null;
    },
    [allCustomCards, deviceMap]
  );
  const lightRooms = useMemo(() => {
    const roomsWithLights = new Set<string>();
    lightDeviceMap.forEach((device) => {
      const room = getDeviceRoom(device);
      if (room) {
        roomsWithLights.add(room);
      }
    });
    return roomOrder.filter((room) => roomsWithLights.has(room));
  }, [lightDeviceMap, roomOrder]);

  // Get ordered cards for active room
  const orderedCardIds = cardOrders[activeRoom] || [];

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before dragging starts
      },
    })
  );

  // Handle drag over event (real-time reordering while dragging)
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;
      const room = getCardRoom(activeId);
      if (!room || room !== getCardRoom(overId)) {
        return;
      }

      const roomCardIds = cardOrders[room] || [];
      const oldIndex = roomCardIds.indexOf(activeId);
      const newIndex = roomCardIds.indexOf(overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        moveCard(room, oldIndex, newIndex);
      }
    },
    [cardOrders, getCardRoom, moveCard]
  );

  // Handle drag end event (cleanup if needed)
  const handleDragEnd = useCallback((_event: DragEndEvent) => {
    // The reordering already happened in handleDragOver
    // This is just for cleanup or final state updates if needed
  }, []);

  // Get custom cards for active room
  const customCards = getCardsForRoom(activeRoom);

  // Handle adding a new card
  const handleAddCard = useCallback(
    (type: CardType, size: CardSize) => {
      addCard(type, size, activeRoom);
      toast.success(`Added ${type} widget to ${activeRoom}!`);
    },
    [activeRoom, addCard]
  );

  // Handle deleting a card
  const handleDeleteCard = useCallback(
    (cardId: string) => {
      removeCard(cardId);
      toast.success('Widget deleted');
    },
    [removeCard]
  );

  const handleAddEntity = useCallback(
    (entityId: string) => {
      addManualEntity(entityId);
      toast.success('Entity added to dashboard');
    },
    [addManualEntity]
  );

  const handleRemoveEntity = useCallback(
    (entityId: string) => {
      removeManualEntity(entityId);
      toast.success('Entity removed from dashboard');
    },
    [removeManualEntity]
  );

  // Handle updating a card
  const handleUpdateCard = useCallback(
    (cardId: string, data: Record<string, unknown>) => {
      updateCard(cardId, { data });
    },
    [updateCard]
  );

  // Show loading state during initial load
  if (!devicesLoaded) {
    const message = connecting ? 'Connecting to Home Assistant...' : 'Loading devices...';
    return <LoadingSpinner message={message} fullScreen />;
  }

  // Show connection error if Home Assistant connection failed
  if (error) {
  }

  // Render different sections based on activeSection
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
              dashboardMode === 'manual'
                ? 'No light entities have been added to the dashboard yet.'
                : 'No Home Assistant light entities are currently available.'
            }
            actionLabel={dashboardMode === 'manual' ? 'Add Entity' : undefined}
            onAction={dashboardMode === 'manual' ? () => setShowAddEntityDialog(true) : undefined}
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

  // Default home section
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
          onToggleEditMode={toggleEditMode}
          onMoveRoom={moveRoom}
          onAddCard={() => setShowAddCardDialog(true)}
          onAddEntity={dashboardMode === 'manual' ? () => setShowAddEntityDialog(true) : undefined}
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
              allowEntityRemoval={dashboardMode === 'manual'}
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
              allowEntityRemoval={dashboardMode === 'manual'}
            />
          </RenderProfiler>
        )}

        {dashboardMode === 'manual' &&
          deviceMap.size === 0 &&
          customCards.length === 0 &&
          activeRoom === 'All' && (
            <EmptyState
              icon={Lightbulb}
              title="No Entities Added"
              description="Switch to edit mode and add only the Home Assistant entities you want on the dashboard."
              actionLabel={isEditMode ? 'Add Entity' : undefined}
              onAction={isEditMode ? () => setShowAddEntityDialog(true) : undefined}
            />
          )}

        {showAddCardDialog && (
          <Suspense fallback={null}>
            <AddCardDialog
              open={showAddCardDialog}
              onClose={() => setShowAddCardDialog(false)}
              onAddCard={handleAddCard}
              currentRoom={activeRoom}
            />
          </Suspense>
        )}

        {showAddEntityDialog && (
          <Suspense fallback={null}>
            <AddEntityDialog
              open={showAddEntityDialog}
              onClose={() => setShowAddEntityDialog(false)}
              onAddEntity={handleAddEntity}
              currentRoom={activeRoom}
              deviceMap={availableDeviceMap}
              addedEntityIds={manualEntityIds}
            />
          </Suspense>
        )}
      </DashboardLayout>
    </DndContext>
  );
}

/**
 * App Root Component
 * Handles authentication, configuration, and routing
 */
function AppContent() {
  const { isAuthenticated, config: authConfig } = useAuth();
  const { config: haConfig } = useConfig();
  const { connected, connecting, connect } = useHomeAssistant();
  const disableAnimations = useSettingsStore((state) => state.disableAnimations);

  // Attempt to connect to Home Assistant when authenticated but not connected
  useEffect(() => {
    // Use auth config if available, otherwise fall back to HA config
    const configToUse = authConfig || haConfig;

    if (isAuthenticated && configToUse && !connected && !connecting) {
      connect({
        hassUrl: configToUse.url,
        token: configToUse.token,
      }).catch((_err) => {});
    }
  }, [isAuthenticated, authConfig, haConfig, connected, connecting, connect]);

  useEffect(() => {
    document.documentElement.dataset.noAnimation = disableAnimations ? 'true' : 'false';

    return () => {
      delete document.documentElement.dataset.noAnimation;
    };
  }, [disableAnimations]);

  return (
    <>
      <Toaster />
      {!isAuthenticated ? <LoginPage /> : <Dashboard />}
    </>
  );
}

/**
 * Main App Component
 * Provides app shell providers.
 */
export default function App() {
  return (
    <ConfigProvider>
      <LoadingProvider>
        <ErrorProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ErrorProvider>
      </LoadingProvider>
    </ConfigProvider>
  );
}
