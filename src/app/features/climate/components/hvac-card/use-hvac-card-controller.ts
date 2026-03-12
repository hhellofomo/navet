import { useEffect, useMemo, useState } from 'react';
import { isCompactCardSize } from '@/app/components/shared/card-size-selector';
import { useEntityCardInteractionController } from '@/app/components/shared/entity-card-interaction-controller';
import { useTheme } from '@/app/hooks';
import type { HVACCardProps } from './hvac-card.types';

export function useHVACCardController({
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
  | 'name'
  | 'initialTemp'
  | 'initialCurrentTemp'
  | 'initialMode'
  | 'initialAction'
  | 'initialState'
  | 'isEditMode'
  | 'size'
>) {
  const [targetTemp, setTargetTemp] = useState(initialTemp);
  const [currentTemp, setCurrentTemp] = useState(initialCurrentTemp);
  const [mode, setMode] = useState(initialMode);
  const [action, setAction] = useState(initialAction);
  const [isOn, setIsOn] = useState(initialState);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { colors, theme } = useTheme();

  useEffect(() => {
    setTargetTemp(initialTemp);
  }, [initialTemp]);

  useEffect(() => {
    setCurrentTemp(initialCurrentTemp);
  }, [initialCurrentTemp]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setAction(initialAction);
  }, [initialAction]);

  useEffect(() => {
    setIsOn(initialState);
  }, [initialState]);

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
  const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';

  const cardInteraction = useEntityCardInteractionController({
    ariaLabel: `${name} hvac`,
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
