import { createContext, useContext, ReactNode } from 'react';
import { type CardSize } from '../components/card-size-selector';

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
  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
};
