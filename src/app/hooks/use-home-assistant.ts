import { useCallback, useEffect, useState } from 'react';
import type { HomeAssistantConfiguration } from '../services/home-assistant.service';
import { homeAssistantStore } from '../stores/home-assistant-store';

/**
 * Custom hook for Home Assistant connection management
 * Provides state and actions for connecting to Home Assistant
 */
export const useHomeAssistant = () => {
  const [state, setState] = useState(() => homeAssistantStore.getState());

  useEffect(() => {
    // Subscribe to store changes
    const unsubscribe = homeAssistantStore.subscribe(setState);

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const connect = useCallback(async (config: HomeAssistantConfiguration) => {
    return await homeAssistantStore.getState().connect(config);
  }, []);

  const disconnect = useCallback(() => {
    homeAssistantStore.getState().disconnect();
  }, []);

  const clearError = useCallback(() => {
    homeAssistantStore.getState().clearError();
  }, []);

  return {
    // State
    ...state,

    // Actions
    connect,
    disconnect,
    clearError,
  };
};
