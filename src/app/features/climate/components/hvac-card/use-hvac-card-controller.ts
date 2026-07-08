import { useState } from 'react';
import { isCompactCardSize } from '@/app/components/shared/card-size-selector';
import { useEntityCardInteractionController } from '@/app/components/shared/entity-card-interaction-controller';
import { useTheme } from '@/app/hooks';
import type { HVACCardProps } from './hvac-card.types';

export function useHVACCardController({
  name,
  initialTemp = 21,
  initialCurrentTemp = 22,
  initialMode = 'cool',
  initialState = true,
  isEditMode,
  size,
}: Pick<
  HVACCardProps,
  | 'name'
  | 'initialTemp'
  | 'initialCurrentTemp'
  | 'initialMode'
  | 'initialState'
  | 'isEditMode'
  | 'size'
>) {
  const [targetTemp, setTargetTemp] = useState(initialTemp);
  const [currentTemp] = useState(initialCurrentTemp);
  const [mode, setMode] = useState(initialMode);
  const [isOn, setIsOn] = useState(initialState);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { colors, theme } = useTheme();

  const isSmall = isCompactCardSize(size);
  const isMedium = size === 'medium';

  const cardColors = !isOn
    ? colors.hvac.off
    : mode === 'cool'
      ? colors.hvac.cooling
      : mode === 'heat'
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
        ? mode === 'cool'
          ? 'bg-cyan-50/45'
          : mode === 'heat'
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
