import { useCallback, useEffect, useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { DashboardLayout } from './features/dashboard/dashboard-layout';
import { DeviceGrid } from './features/dashboard/device-grid';
import { AllViewGrid } from './features/dashboard/all-view-grid';
import { LoginPage } from './features/auth/login-page';
import { RoomNav } from './components/room-nav';
import { SetupWizard } from './components/setup-wizard';
import { LoadingSpinner } from './components/loading-spinner';
import { AddCardDialog, type CardType } from './components/add-card-dialog';
import { EditModeProvider } from './contexts/edit-mode-context';
import { ThemeProvider } from './contexts/theme-context';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { ConfigProvider, useConfig } from './contexts/config-context';
import { LoadingProvider } from './contexts/loading-context';
import { ErrorProvider } from './contexts/error-context';
import { NavigationProvider, useNavigation } from './contexts/navigation-context';
import { SearchProvider } from './contexts/search-context';
import { SecuritySection, TasksSection, LocksSection, LightsSection, MediaSection, SettingsSection } from './components/sections';
import { 
  useCardState, 
  useCardOrdering, 
  useRoomNavigation, 
  useEditMode, 
  useDeviceMap 
} from './hooks';
import { useDevices, useRooms } from './hooks/use-devices';
import { useCustomCards } from './hooks/use-custom-cards';

/**
 * Dashboard Component
 * The main dashboard view after authentication
 */
function Dashboard() {
  const { activeSection } = useNavigation();
  const [devicesLoaded, setDevicesLoaded] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  
  // Simulate initial device loading
  useEffect(() => {
    const loadDevices = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setDevicesLoaded(true);
      } catch (err) {
        console.error('Failed to load devices:', err);
        setDevicesLoaded(true); // Still show dashboard even if load fails
      }
    };

    loadDevices();
  }, []);

  // Fetch devices (mock data for now, would be React Query in production)
  const devices = useDevices();
  const rooms = useRooms(devices);
  
  // Custom hooks for state management
  const { activeRoom, changeRoom } = useRoomNavigation('All'); // Default to All view
  const { isEditMode, toggleEditMode } = useEditMode();
  const { cardSizes, updateCardSize } = useCardState(devices);
  const { cardOrders, moveCard } = useCardOrdering(devices, rooms);
  const { deviceMap } = useDeviceMap(devices);
  const { addCard, removeCard, updateCard, getCardsForRoom } = useCustomCards();

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
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = orderedCardIds.indexOf(active.id as string);
    const newIndex = orderedCardIds.indexOf(over.id as string);

    if (oldIndex !== -1 && newIndex !== -1) {
      moveCard(activeRoom, oldIndex, newIndex);
    }
  }, [activeRoom, moveCard, orderedCardIds]);

  // Handle drag end event (cleanup if needed)
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    // The reordering already happened in handleDragOver
    // This is just for cleanup or final state updates if needed
  }, []);
  
  // Get custom cards for active room
  const customCards = getCardsForRoom(activeRoom);

  // Handle adding a new card
  const handleAddCard = useCallback((type: CardType, size: 'small' | 'medium' | 'large') => {
    addCard(type, size, activeRoom);
    toast.success(`Added ${type} widget to ${activeRoom}!`);
  }, [activeRoom, addCard]);

  // Handle deleting a card
  const handleDeleteCard = useCallback((cardId: string) => {
    removeCard(cardId);
    toast.success('Widget deleted');
  }, [removeCard]);

  // Handle updating a card
  const handleUpdateCard = useCallback((cardId: string, data: Record<string, unknown>) => {
    updateCard(cardId, { data });
  }, [updateCard]);

  // Edit mode context value
  const editModeContextValue = {
    isEditMode,
    toggleEditMode,
    cardSizes,
    updateCardSize
  };

  // Show loading state during initial load
  if (!devicesLoaded) {
    return <LoadingSpinner message="Loading devices..." fullScreen />;
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
        <LightsSection />
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
            activeRoom={activeRoom} 
            onRoomChange={changeRoom} 
            isEditMode={isEditMode}
            onToggleEditMode={toggleEditMode}
            onAddCard={() => setShowAddCardDialog(true)}
          />
          
          {activeRoom === 'All' ? (
            <AllViewGrid 
              deviceMap={deviceMap}
              rooms={rooms}
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
  const { isAuthenticated } = useAuth();
  const { isConfigured } = useConfig();
  
  return (
    <>
      <Toaster />
      {!isConfigured ? (
        <SetupWizard />
      ) : !isAuthenticated ? (
        <LoginPage />
      ) : (
        <Dashboard />
      )}
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
                  <AppContent />
                </NavigationProvider>
              </SearchProvider>
            </AuthProvider>
          </ErrorProvider>
        </LoadingProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}