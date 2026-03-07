import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type DashboardEntityMode = 'auto' | 'manual';

interface DashboardEntitiesState {
  mode: DashboardEntityMode;
  manualEntityIds: string[];
  setMode: (mode: DashboardEntityMode) => void;
  addEntity: (entityId: string) => void;
  removeEntity: (entityId: string) => void;
  resetManualEntities: () => void;
}

export const useDashboardEntitiesStore = create<DashboardEntitiesState>()(
  persist(
    (set) => ({
      mode: 'auto',
      manualEntityIds: [],
      setMode: (mode) => set({ mode }),
      addEntity: (entityId) =>
        set((state) => ({
          manualEntityIds: state.manualEntityIds.includes(entityId)
            ? state.manualEntityIds
            : [...state.manualEntityIds, entityId],
        })),
      removeEntity: (entityId) =>
        set((state) => ({
          manualEntityIds: state.manualEntityIds.filter((id) => id !== entityId),
        })),
      resetManualEntities: () => set({ manualEntityIds: [] }),
    }),
    {
      name: 'navet-dashboard-entities',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
