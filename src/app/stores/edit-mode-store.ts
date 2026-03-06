import { create } from 'zustand';

interface EditModeState {
  isEditMode: boolean;
  setEditMode: (isEditMode: boolean) => void;
  toggleEditMode: () => void;
}

export const useEditModeStore = create<EditModeState>((set) => ({
  isEditMode: false,
  setEditMode: (isEditMode) => set({ isEditMode }),
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
}));
