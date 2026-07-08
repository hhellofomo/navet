import { createContext, type ReactNode, useContext } from 'react';
import type { CardSize } from '../components/card-size-selector';
import { useEditModeStore } from '../stores/edit-mode-store';
import { editModeSelectors } from '../stores/selectors';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const useEditModeContext = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditModeContext must be used within EditModeProvider');
  }
  return context;
};

interface EditModeProviderProps {
  children: ReactNode;
  value: EditModeContextType;
}

export const EditModeProvider = ({ children, value }: EditModeProviderProps) => {
  // Use the edit mode store for the edit mode state
  const isEditMode = useEditModeStore(editModeSelectors.isEditMode);
  const toggleEditMode = useEditModeStore(editModeSelectors.toggleEditMode);

  // Combine store state with passed value
  const contextValue = {
    ...value,
    isEditMode,
    toggleEditMode,
  };

  return <EditModeContext.Provider value={contextValue}>{children}</EditModeContext.Provider>;
};
