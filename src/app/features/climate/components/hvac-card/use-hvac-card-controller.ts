import { useEffect, useMemo, useState } from 'react';
import { isCompactCardSize } from '@/app/components/shared/card-size-selector';
import { useEntityCardInteractionController } from '@/app/components/shared/entity-card-interaction-controller';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useHomeAssistant, useI18n, useTheme } from '@/app/hooks';
import { homeAssistantSelectors } from '@/app/stores/selectors';
import type { HVACCardProps } from './hvac-card.types';

export function useHVACCardController({
  id,
  name,
  initialTemp = 21,
  initialCurrentTemp = 22,
  initialMode = 'cool',
  initialAction,
  initialState = true,
  isEditMode,
  size,
}: Pick<
  HVACCardProps,
  | 'id'
  | 'name'
  | 'initialTemp'
  | 'initialCurrentTemp'
  | 'initialMode'
  | 'initialAction'
  | 'initialState'
  | 'isEditMode'
  | 'size'
>) {
  const { t } = useI18n();
  const [targetTemp, setTargetTemp] = useState(initialTemp);
  const [currentTemp, setCurrentTemp] = useState(initialCurrentTemp);
  const [mode, setMode] = useState(initialMode);
  const [action, setAction] = useState(initialAction);
  const [isOn, setIsOn] = useState(initialState);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { colors, theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const liveEntity = useHomeAssistant(homeAssistantSelectors.entity(id));

  // Single effect syncs all HA-driven fields in one batch when the entity updates.
  useEffect(() => {
    if (liveEntity) {
      const attrs = liveEntity.attributes as Record<string, unknown>;
      setIsOn(liveEntity.state !== 'off');
      setMode(typeof attrs.hvac_mode === 'string' ? attrs.hvac_mode : initialMode);
      setAction(typeof attrs.hvac_action === 'string' ? attrs.hvac_action : initialAction);
      if (typeof attrs.temperature === 'number') setTargetTemp(attrs.temperature);
      if (typeof attrs.current_temperature === 'number') setCurrentTemp(attrs.current_temperature);
      return;
    }
    setTargetTemp(initialTemp);
    setCurrentTemp(initialCurrentTemp);
    setMode(initialMode);
    setAction(initialAction);
    setIsOn(initialState);
  }, [liveEntity, initialTemp, initialCurrentTemp, initialMode, initialAction, initialState]);

  const isSmall = isCompactCardSize(size);
  const isMedium = size === 'medium';

  const visualMode = useMemo(() => {
    const normalizedAction = action?.toLowerCase() ?? '';
    const normalizedMode = mode.toLowerCase();
    const temperatureDelta = targetTemp - currentTemp;

    if (!isOn) {
      return 'off';
    }

    if (normalizedAction.includes('fan')) {
      return 'fan';
    }

    if (normalizedAction.includes('heat')) {
      return 'heat';
    }

    if (normalizedAction.includes('cool')) {
      return 'cool';
    }

    if (normalizedMode === 'fan' || normalizedMode === 'fan_only') {
      return 'fan';
    }

    if (temperatureDelta > 0.05) {
      return 'heat';
    }

    if (temperatureDelta < -0.05) {
      return 'cool';
    }

    if (normalizedMode === 'heat') {
      return 'heat';
    }

    if (normalizedMode === 'cool') {
      return 'cool';
    }

    return normalizedMode;
  }, [action, currentTemp, isOn, mode, targetTemp]);

  const cardColors = !isOn
    ? colors.hvac.off
    : visualMode === 'cool'
      ? colors.hvac.cooling
      : visualMode === 'heat'
        ? colors.hvac.heating
        : colors.hvac.off;

  const textColor =
    theme === 'light'
      ? isOn
        ? 'text-gray-900'
        : 'text-gray-500'
      : isOn
        ? 'text-white'
        : 'text-gray-300';
  const secondaryTextColor = surface.textSecondary;

  const cardInteraction = useEntityCardInteractionController({
    ariaLabel: `${name} ${t('climate.subtitle').toLowerCase()}`,
    ariaPressed: isOn,
    isEditMode,
    onToggle: () => setIsOn((current) => !current),
    onOpenControls: () => setIsSettingsOpen(true),
    onOpenSettings: () => setIsSettingsOpen(true),
  });

  const lightOverlay =
    theme === 'light'
      ? isOn
        ? visualMode === 'cool'
          ? 'bg-cyan-50/45'
          : visualMode === 'heat'
            ? 'bg-orange-50/45'
            : 'bg-white/60'
        : 'bg-white/60'
      : undefined;

  return {
    cardColors,
    cardInteraction,
    currentTemp,
    isMedium,
    isOn,
    isSettingsOpen,
    isSmall,
    lightOverlay,
    mode,
    visualMode,
    secondaryTextColor,
    setIsOn,
    setIsSettingsOpen,
    setMode,
    setTargetTemp,
    targetTemp,
    textColor,
    theme,
  };
}
