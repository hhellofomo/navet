import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { RoomNav } from './components/layout/room-nav';
import {
	LightsSection,
	LocksSection,
	MediaSection,
	SecuritySection,
	TasksSection,
} from './components/layout/sections';
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
} from './hooks';
import { useCustomCards } from './hooks/use-custom-cards';
import { useDevices, useRooms } from './hooks/use-devices';
import { useHADevices } from './hooks/use-ha-devices';

/**
 * Dashboard Component
 * The main dashboard view after authentication
 */
function Dashboard() {
	const { activeSection } = useNavigation();
	const { connected, connecting, error } = useHomeAssistantContext();
	const [devicesLoaded, setDevicesLoaded] = useState(false);
	const [showAddCardDialog, setShowAddCardDialog] = useState(false);

	// Fetch devices from Home Assistant or fallback to mock data
	const haDevices = useHADevices();
	const mockDevices = useDevices();
	const devices = connected ? haDevices : mockDevices;
	const rooms = useRooms(devices);

	// Set devices loaded when connected or when mock devices are ready
	useEffect(() => {
		if (connected || !connecting) {
			setDevicesLoaded(true);
		}
	}, [connected, connecting]);

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
	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			const { active, over } = event;

			if (!over || active.id === over.id) {
				return;
			}

			const oldIndex = orderedCardIds.indexOf(active.id as string);
			const newIndex = orderedCardIds.indexOf(over.id as string);

			if (oldIndex !== -1 && newIndex !== -1) {
				moveCard(activeRoom, oldIndex, newIndex);
			}
		},
		[activeRoom, moveCard, orderedCardIds]
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
	const { isAuthenticated, config: authConfig } = useAuth();
	const { config: haConfig } = useConfig();
	const { connected, connecting, connect } = useHomeAssistantContext();

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
