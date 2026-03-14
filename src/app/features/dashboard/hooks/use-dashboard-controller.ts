import type { DragEndEvent, DragOverEvent, useSensors } from '@dnd-kit/core';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { STORAGE_KEYS } from '@/app/constants/storage-keys';
import {
  useCardState,
  useDashboardDevices,
  useDeviceMap,
  useEditMode,
  useHomeAssistant,
  useI18n,
  useNavigation,
  usePersistedState,
  useRoomNavigation,
} from '@/app/hooks';
import { useDevices, useRooms } from '@/app/hooks/use-devices';
import type { Section } from '@/app/navigation/sections';
import { importDashboardConfigFromFile } from '@/app/utils/dashboard-config';
import type { AllViewGrouping } from '../all-view-grid';
import type { CardType } from '../components/add-card-dialog';
import { useDashboardEntitiesStore } from '../stores/dashboard-entities-store';
import { useCardOrdering } from './use-card-ordering';
import { useCustomCards } from './use-custom-cards';
import { useDashboardDerivedState } from './use-dashboard-derived-state';
import { useDashboardDnd } from './use-dashboard-dnd';
import { useRoomOrdering } from './use-room-ordering';

export interface DashboardController {
  activeRoom: string;
  activeSection: Section;
  addableEntityIds: string[];
  allEntityIds: string[];
  allViewGrouping: AllViewGrouping;
  availableDeviceMap: ReturnType<typeof useDeviceMap>['deviceMap'];
  cardOrders: ReturnType<typeof useCardOrdering>['cardOrders'];
  cardSizes: ReturnType<typeof useCardState>['cardSizes'];
  changeRoom: (room: string) => void;
  customCards: ReturnType<typeof useCustomCards>['getCardsForRoom'] extends (
    room: string
  ) => infer T
    ? T
    : never;
  dashboardArrivalVariant: 'all' | 'blank' | 'import' | null;
  deviceMap: ReturnType<typeof useDeviceMap>['deviceMap'];
  connecting: boolean;
  devicesLoaded: boolean;
  handleAddCard: (type: CardType, size: CardSize) => void;
  handleAddEntity: (entityId: string) => void;
  handleChooseAllEntities: () => void;
  handleChooseBlankDashboard: () => void;
  handleDeleteCard: (cardId: string) => void;
  handleDragEnd: (_event: DragEndEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleImportDashboardConfig: (file: File) => Promise<void>;
  handleOnboardingImportDashboardConfig: (file: File) => Promise<void>;
  handleRemoveEntity: (entityId: string) => void;
  handleUpdateCard: (cardId: string, data: Record<string, unknown>) => void;
  hiddenEntityIds: string[];
  isOnboardingClosing: boolean;
  isEditMode: boolean;
  lightDeviceMap: ReturnType<typeof useDeviceMap>['deviceMap'];
  lightRooms: string[];
  onboardingCompleted: boolean;
  onCompleteOnboardingClose: () => void;
  onCloseAddCardDialog: () => void;
  onCloseAddEntityDialog: () => void;
  onEnterEditMode: () => void;
  onOpenAddCardDialog: () => void;
  onOpenAddEntityDialog: () => void;
  onToggleEditMode: () => void;
  orderedCardIds: string[];
  onDismissImportedDashboardReveal: () => void;
  onMoveRoom: (activeRoom: string, overRoom: string) => void;
  onSetAllViewGrouping: (grouping: AllViewGrouping) => void;
  roomOrder: string[];
  sensors: ReturnType<typeof useSensors>;
  setActiveSection: (section: Section) => void;
  showImportedDashboardReveal: boolean;
  showAddCardDialog: boolean;
  showAddEntityDialog: boolean;
  updateCardSize: ReturnType<typeof useCardState>['updateCardSize'];
}

export function useDashboardController(): DashboardController {
  type OnboardingTransition = 'all' | 'blank' | 'import' | null;

  const { activeSection, setActiveSection } = useNavigation();
  const { t } = useI18n();
  const { connected, connecting } = useHomeAssistant();
  const [devicesLoaded, setDevicesLoaded] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [onboardingTransition, setOnboardingTransition] = useState<OnboardingTransition>(null);
  const [dashboardArrivalVariant, setDashboardArrivalVariant] =
    useState<OnboardingTransition>(null);
  const [showImportedDashboardReveal, setShowImportedDashboardReveal] = useState(false);
  const [allViewGrouping, setAllViewGrouping] = usePersistedState<AllViewGrouping>(
    STORAGE_KEYS.allViewGrouping,
    'custom'
  );
  const hiddenEntityIds = useDashboardEntitiesStore((state) => state.hiddenEntityIds);
  const onboardingCompleted = useDashboardEntitiesStore((state) => state.onboardingCompleted);
  const completeOnboarding = useDashboardEntitiesStore((state) => state.completeOnboarding);
  const hideAutoEntity = useDashboardEntitiesStore((state) => state.hideEntity);
  const showAutoEntity = useDashboardEntitiesStore((state) => state.showEntity);

  const allDevices = useDevices();
  const devices = useDashboardDevices(allDevices, hiddenEntityIds);
  const rooms = useRooms(devices);

  useEffect(() => {
    if (connected || !connecting) {
      setDevicesLoaded(true);
    }
  }, [connected, connecting]);

  const { activeRoom, changeRoom } = useRoomNavigation('All');
  const { addCard, removeCard, updateCard, getCardsForRoom } = useCustomCards();
  const allCustomCards = getCardsForRoom('All');
  const { isEditMode, setEditMode, toggleEditMode } = useEditMode();
  const { cardSizes, updateCardSize } = useCardState(devices);
  const { cardOrders, moveCard } = useCardOrdering(devices, rooms, allCustomCards);
  const { roomOrder, moveRoom } = useRoomOrdering(rooms);
  const { deviceMap } = useDeviceMap(devices);
  const { deviceMap: availableDeviceMap } = useDeviceMap(allDevices);
  const {
    addableEntityIds,
    allEntityIds,
    getCardRoom,
    lightDeviceMap,
    lightRooms,
    orderedCardIds,
  } = useDashboardDerivedState({
    activeRoom,
    allCustomCards,
    availableDeviceMap,
    cardOrders,
    deviceMap,
    hiddenEntityIds,
    roomOrder,
  });
  const { handleDragEnd, handleDragOver, sensors } = useDashboardDnd({
    cardOrders,
    getCardRoom,
    moveCard,
  });

  const customCards = getCardsForRoom(activeRoom);

  const handleAddCard = useCallback(
    (type: CardType, size: CardSize) => {
      addCard(type, size, activeRoom);
      toast.success(t('dashboard.feedback.widgetAdded', { type, room: activeRoom }));
    },
    [activeRoom, addCard, t]
  );

  const handleDeleteCard = useCallback(
    (cardId: string) => {
      removeCard(cardId);
      toast.success(t('dashboard.feedback.widgetDeleted'));
    },
    [removeCard, t]
  );

  const handleAddEntity = useCallback(
    (entityId: string) => {
      showAutoEntity(entityId);
      toast.success(t('dashboard.feedback.entityAdded'));
    },
    [showAutoEntity, t]
  );

  const handleRemoveEntity = useCallback(
    (entityId: string) => {
      hideAutoEntity(entityId);
      toast.success(t('dashboard.feedback.entityRemoved'));
    },
    [hideAutoEntity, t]
  );

  const handleImportDashboardConfig = useCallback(
    async (file: File) => {
      try {
        await importDashboardConfigFromFile(file);
        toast.success(t('dashboard.feedback.configImported'));
        window.setTimeout(() => {
          window.location.reload();
        }, 600);
      } catch {
        toast.error(t('dashboard.feedback.configImportFailed'));
      }
    },
    [t]
  );

  const handleOnboardingImportDashboardConfig = useCallback(
    async (file: File) => {
      try {
        await importDashboardConfigFromFile(file);
        setActiveSection('home');
        changeRoom('All');
        setOnboardingTransition('import');
        toast.success(t('dashboard.feedback.configRestored'));
      } catch {
        toast.error(t('dashboard.feedback.configImportFailed'));
      }
    },
    [changeRoom, setActiveSection, t]
  );

  const handleCompleteOnboardingClose = useCallback(() => {
    if (onboardingTransition === 'all') {
      completeOnboarding(allEntityIds, false);
    } else if (onboardingTransition === 'blank') {
      completeOnboarding(allEntityIds, true);
    } else if (onboardingTransition === 'import') {
      useDashboardEntitiesStore.setState((state) => ({
        ...state,
        onboardingCompleted: true,
      }));
    } else {
      return;
    }

    setDashboardArrivalVariant(onboardingTransition);
    setOnboardingTransition(null);
    setShowImportedDashboardReveal(true);
  }, [allEntityIds, completeOnboarding, onboardingTransition]);

  const handleChooseAllEntities = useCallback(() => {
    setActiveSection('home');
    changeRoom('All');
    setOnboardingTransition('all');
  }, [changeRoom, setActiveSection]);

  const handleChooseBlankDashboard = useCallback(() => {
    setActiveSection('home');
    changeRoom('All');
    setOnboardingTransition('blank');
  }, [changeRoom, setActiveSection]);

  const handleUpdateCard = useCallback(
    (cardId: string, data: Record<string, unknown>) => {
      updateCard(cardId, { data });
    },
    [updateCard]
  );

  return {
    activeRoom,
    activeSection,
    addableEntityIds,
    allEntityIds,
    allViewGrouping,
    availableDeviceMap,
    cardOrders,
    cardSizes,
    changeRoom,
    customCards,
    dashboardArrivalVariant,
    deviceMap,
    connecting,
    devicesLoaded,
    handleAddCard,
    handleAddEntity,
    handleChooseAllEntities,
    handleChooseBlankDashboard,
    handleDeleteCard,
    handleDragEnd,
    handleDragOver,
    handleImportDashboardConfig,
    handleOnboardingImportDashboardConfig,
    handleRemoveEntity,
    handleUpdateCard,
    hiddenEntityIds,
    isOnboardingClosing: onboardingTransition !== null,
    isEditMode,
    lightDeviceMap,
    lightRooms,
    onboardingCompleted,
    onCompleteOnboardingClose: handleCompleteOnboardingClose,
    onCloseAddCardDialog: () => setShowAddCardDialog(false),
    onCloseAddEntityDialog: () => setShowAddEntityDialog(false),
    onDismissImportedDashboardReveal: () => {
      setDashboardArrivalVariant(null);
      setShowImportedDashboardReveal(false);
    },
    onEnterEditMode: () => setEditMode(true),
    onMoveRoom: moveRoom,
    onSetAllViewGrouping: setAllViewGrouping,
    onOpenAddCardDialog: () => setShowAddCardDialog(true),
    onOpenAddEntityDialog: () => setShowAddEntityDialog(true),
    onToggleEditMode: toggleEditMode,
    orderedCardIds,
    roomOrder,
    sensors,
    setActiveSection,
    showImportedDashboardReveal,
    showAddCardDialog,
    showAddEntityDialog,
    updateCardSize,
  };
}
