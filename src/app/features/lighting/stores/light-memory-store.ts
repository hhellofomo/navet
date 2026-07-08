import { create } from 'zustand';

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

export const useLightMemoryStore = create<LightMemoryState>((set, get) => ({
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
}));
