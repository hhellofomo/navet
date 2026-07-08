import { useCallback } from 'react';
import { useStore } from 'zustand';
import type { HomeAssistantConfiguration } from '../services/home-assistant.service';
import { homeAssistantStore } from '../stores/home-assistant-store';

/**
 * Custom hook for Home Assistant connection management
 * Provides state and actions for connecting to Home Assistant
 */
export const useHomeAssistant = () => {
  const state = useStore(homeAssistantStore);

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
    ...state,
    connect,
    disconnect,
    clearError,
  };
};
