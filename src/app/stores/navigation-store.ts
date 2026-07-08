import { create } from 'zustand';
import { isSection, type Section } from '../navigation/sections';

interface NavigationState {
  currentRoom: string;
  activeSection: Section;
  setCurrentRoom: (room: string) => void;
  setActiveSection: (section: Section) => void;
}

const NAVIGATION_STORAGE_KEY = 'ha-dashboard-navigation';

type PersistedNavigationState = Pick<NavigationState, 'currentRoom' | 'activeSection'>;

const DEFAULT_NAVIGATION_STATE: PersistedNavigationState = {
  currentRoom: 'All',
  activeSection: 'home',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeNavigationState = (
  state: Partial<PersistedNavigationState> | null | undefined
): PersistedNavigationState => ({
  currentRoom:
    typeof state?.currentRoom === 'string' && state.currentRoom.length > 0
      ? state.currentRoom
      : DEFAULT_NAVIGATION_STATE.currentRoom,
  activeSection: isSection(state?.activeSection)
    ? state.activeSection
    : DEFAULT_NAVIGATION_STATE.activeSection,
});

const readInitialNavigationState = (): PersistedNavigationState => {
  if (typeof window === 'undefined') {
    return DEFAULT_NAVIGATION_STATE;
  }

  try {
    const rawValue = window.localStorage.getItem(NAVIGATION_STORAGE_KEY);
    if (!rawValue) {
      return DEFAULT_NAVIGATION_STATE;
    }

    const parsed = JSON.parse(rawValue) as unknown;
    const persisted = isRecord(parsed) && 'state' in parsed ? parsed.state : parsed;

    return normalizeNavigationState(isRecord(persisted) ? persisted : null);
  } catch {
    return DEFAULT_NAVIGATION_STATE;
  }
};

const writeNavigationSnapshot = (state: PersistedNavigationState) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    NAVIGATION_STORAGE_KEY,
    JSON.stringify({
      state,
      version: 0,
    })
  );
};

const initialNavigationState = readInitialNavigationState();

export const useNavigationStore = create<NavigationState>((set) => ({
  ...initialNavigationState,
  setCurrentRoom: (currentRoom) => {
    set((state) => ({ ...state, currentRoom }));
  },
  setActiveSection: (activeSection) => {
    set((state) => ({ ...state, activeSection }));
  },
}));

if (typeof window !== 'undefined') {
  useNavigationStore.subscribe((state) => {
    writeNavigationSnapshot({
      currentRoom: state.currentRoom,
      activeSection: state.activeSection,
    });
  });
}
