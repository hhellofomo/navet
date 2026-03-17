import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/app/constants/storage-keys';

interface RememberedLightState {
  brightness?: number;
  colorTemp?: number;
}

interface LightMemoryState {
  rememberedStates: Record<string, RememberedLightState>;
  rememberState: (entityId: string, state: RememberedLightState) => void;
  getRememberedState: (entityId: string) => RememberedLightState | undefined;
  clearRememberedState: (entityId: string) => void;
}

export const useLightMemoryStore = create<LightMemoryState>()(
  persist(
    (set, get) => ({
      rememberedStates: {},
      rememberState: (entityId, state) =>
        set((current) => ({
          rememberedStates: {
            ...current.rememberedStates,
            [entityId]: {
              ...current.rememberedStates[entityId],
              ...state,
            },
          },
        })),
      getRememberedState: (entityId) => get().rememberedStates[entityId],
      clearRememberedState: (entityId) =>
        set((current) => {
          const next = { ...current.rememberedStates };
          delete next[entityId];
          return { rememberedStates: next };
        }),
    }),
    {
      name: STORAGE_KEYS.lightMemoryState,
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const p = persisted as Partial<LightMemoryState>;
        return {
          ...current,
          rememberedStates:
            p?.rememberedStates && typeof p.rememberedStates === 'object' ? p.rememberedStates : {},
        };
      },
    }
  )
);
