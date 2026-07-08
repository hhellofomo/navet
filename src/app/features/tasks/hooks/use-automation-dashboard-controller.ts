import { useMemo } from 'react';
import { useHomeAssistant } from '@/app/hooks';
import { homeAssistantSelectors, settingsSelectors } from '@/app/stores/selectors';
import { useSettingsStore } from '@/app/stores/settings-store';
import { useTaskRoutines } from './use-task-automation-groups';

export function useAutomationDashboardController() {
  const { automations, quickActions } = useTaskRoutines();
  const connected = useHomeAssistant(homeAssistantSelectors.connected);
  const entitiesHydrated = useHomeAssistant(homeAssistantSelectors.entitiesHydrated);
  const disableAnimations = useSettingsStore(settingsSelectors.disableAnimations);
  const effectsQuality = useSettingsStore(settingsSelectors.effectsQuality);
  const lowPowerMode = useSettingsStore(settingsSelectors.lowPowerMode);
  const enabledAutomations = useMemo(
    () => automations.filter((automation) => automation.enabled),
    [automations]
  );
  const disabledAutomations = useMemo(
    () => automations.filter((automation) => !automation.enabled),
    [automations]
  );
  const latestAutomation = useMemo(
    () =>
      automations
        .filter((automation) => automation.lastTriggered)
        .sort((left, right) => {
          const leftTime = new Date(left.lastTriggered ?? '').getTime();
          const rightTime = new Date(right.lastTriggered ?? '').getTime();

          const safeRightTime = Number.isFinite(rightTime) ? rightTime : 0;
          const safeLeftTime = Number.isFinite(leftTime) ? leftTime : 0;

          return safeRightTime - safeLeftTime;
        })[0],
    [automations]
  );
  const shouldReduceMotion = disableAnimations || lowPowerMode || effectsQuality === 'low';

  return {
    automations,
    quickActions,
    enabledAutomations,
    disabledAutomations,
    latestAutomation,
    connected,
    isLoading: !entitiesHydrated,
    hasError: entitiesHydrated && !connected,
    shouldReduceMotion,
  };
}
