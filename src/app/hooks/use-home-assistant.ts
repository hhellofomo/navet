import { useStoreWithEqualityFn } from 'zustand/traditional';
import { type HomeAssistantStore, homeAssistantStore } from '../stores/home-assistant-store';

/**
 * Custom hook for Home Assistant connection management
 * Subscribe to the minimal Home Assistant store slice needed by a component.
 */
export const useHomeAssistant = <T>(
  selector: (state: HomeAssistantStore) => T,
  equalityFn?: (a: T, b: T) => boolean
): T => useStoreWithEqualityFn(homeAssistantStore, selector, equalityFn);
