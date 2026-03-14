import { useStore } from 'zustand';
import { type HomeAssistantStore, homeAssistantStore } from '../stores/home-assistant-store';

/**
 * Custom hook for Home Assistant connection management
 * Subscribe to the minimal Home Assistant store slice needed by a component.
 */
export const useHomeAssistant = <T>(selector: (state: HomeAssistantStore) => T): T =>
  useStore(homeAssistantStore, selector);
