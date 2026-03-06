import { useState, useCallback } from 'react';

/**
 * Custom hook for managing edit mode state
 * Provides toggle functionality for card editing mode
 */
export const useEditMode = (initialState = false) => {
  const [isEditMode, setIsEditMode] = useState(initialState);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  const setEditMode = useCallback((mode: boolean) => {
    setIsEditMode(mode);
  }, []);

  return { isEditMode, toggleEditMode, setEditMode };
};
