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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { RoomNav } from './components/layout/room-nav';
import {
  LocksSection,
  MediaSection,
  SecuritySection,
  TasksSection,
} from './components/layout/sections';
import { EmptyState } from './components/shared/empty-state';
import { LoadingSpinner } from './components/shared/loading-spinner';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { ConfigProvider, useConfig } from './contexts/config-context';
import { EditModeProvider } from './contexts/edit-mode-context';
import { ErrorProvider } from './contexts/error-context';
import { HomeAssistantProvider, useHomeAssistantContext } from './contexts/home-assistant-context';
import { LoadingProvider } from './contexts/loading-context';
import { NavigationProvider, useNavigation } from './contexts/navigation-context';
import { SearchProvider } from './contexts/search-context';
import { ThemeProvider } from './contexts/theme-context';
import { LoginPage } from './features/auth/login-page';
import { AllViewGrid } from './features/dashboard/all-view-grid';
import { AddCardDialog, type CardType } from './features/dashboard/components/add-card-dialog';
import { DashboardLayout } from './features/dashboard/dashboard-layout';
import { DeviceGrid } from './features/dashboard/device-grid';
import { SettingsSection } from './features/settings/components/settings-section';
import {
  useCardOrdering,
  useCardState,
  useDeviceMap,
  useEditMode,
  useRoomNavigation,
  useRoomOrdering,
} from './hooks';
import { useCustomCards } from './hooks/use-custom-cards';
import { useDevices, useRooms } from './hooks/use-devices';
import { useSettingsStore } from './stores';

/**
 * Dashboard Component
 * The main dashboard view after authentication
 */
function Dashboard() {
  const { activeSection } = useNavigation();
  const { connected, connecting, error } = useHomeAssistantContext();
  const [devicesLoaded, setDevicesLoaded] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);

  // Fetch devices with Home Assistant lights and existing fallback behavior for other types
  const devices = useDevices();
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
  const lightDeviceMap = useMemo(
    () => new Map(Array.from(deviceMap.entries()).filter(([, device]) => device.type === 'lights')),
    [deviceMap]
  );
  const getCardRoom = useCallback(
    (cardId: string) => {
      const device = deviceMap.get(cardId);
      if (device) {
        return ('room' in device ? device.room : 'location' in device ? device.location : null) as
          | string
          | null;
      }

      const customCard = allCustomCards.find((card) => card.id === cardId);
      return customCard?.room ?? null;
    },
    [allCustomCards, deviceMap]
  );
  const lightRooms = useMemo(() => {
    const roomsWithLights = new Set<string>();
    lightDeviceMap.forEach((device) => {
      if ('room' in device && device.room) {
        roomsWithLights.add(device.room);
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
    (type: CardType, size: 'small' | 'medium' | 'large') => {
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

  // Handle updating a card
  const handleUpdateCard = useCallback(
    (cardId: string, data: Record<string, unknown>) => {
      updateCard(cardId, { data });
    },
    [updateCard]
  );

  // Edit mode context value
  const editModeContextValue = useMemo(
    () => ({
      isEditMode,
      toggleEditMode,
      cardSizes,
      updateCardSize,
    }),
    [isEditMode, toggleEditMode, cardSizes, updateCardSize]
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
          <EditModeProvider value={editModeContextValue}>
            <AllViewGrid deviceMap={lightDeviceMap} rooms={lightRooms} cardOrders={cardOrders} />
          </EditModeProvider>
        ) : (
          <EmptyState
            icon={Lightbulb}
            title="No Lights"
            description="No Home Assistant light entities are currently available."
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
        <SettingsSection />
      </DashboardLayout>
    );
  }

  // Default home section
  return (
    <EditModeProvider value={editModeContextValue}>
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
          />

          {activeRoom === 'All' ? (
            <AllViewGrid
              deviceMap={deviceMap}
              rooms={roomOrder}
              cardOrders={cardOrders}
              customCards={customCards}
              onDeleteCard={handleDeleteCard}
              onUpdateCard={handleUpdateCard}
            />
          ) : (
            <DeviceGrid
              orderedCardIds={orderedCardIds}
              deviceMap={deviceMap}
              customCards={customCards}
              onDeleteCard={handleDeleteCard}
              onUpdateCard={handleUpdateCard}
            />
          )}

          <AddCardDialog
            open={showAddCardDialog}
            onClose={() => setShowAddCardDialog(false)}
            onAddCard={handleAddCard}
            currentRoom={activeRoom}
          />
        </DashboardLayout>
      </DndContext>
    </EditModeProvider>
  );
}

/**
 * App Root Component
 * Handles authentication, configuration, and routing
 */
function AppContent() {
  const { isAuthenticated, config: authConfig } = useAuth();
  const { config: haConfig } = useConfig();
  const { connected, connecting, connect } = useHomeAssistantContext();
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
 * Provides all context providers
 */
export default function App() {
  return (
    <ThemeProvider>
      <ConfigProvider>
        <LoadingProvider>
          <ErrorProvider>
            <AuthProvider>
              <SearchProvider>
                <NavigationProvider>
                  <HomeAssistantProvider>
                    <AppContent />
                  </HomeAssistantProvider>
                </NavigationProvider>
              </SearchProvider>
            </AuthProvider>
          </ErrorProvider>
        </LoadingProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}
