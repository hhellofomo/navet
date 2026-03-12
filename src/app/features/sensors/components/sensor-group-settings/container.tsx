import * as Dialog from '@radix-ui/react-dialog';
import { memo } from 'react';
import { CustomScrollbar } from '@/app/components/shared/device-editor';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import { iconMap } from '../sensors';
import { SENSOR_GROUP_COLOR_MAP } from './data';
import type { SensorGroupSettingsDialogProps } from './types';
import { useSensorGroupSettings } from './use-sensor-group-settings';
import { SensorGroupSettingsView } from './view';

export const SensorGroupSettingsContainer = memo(function SensorGroupSettingsContainer({
  isOpen,
  onClose,
  groupName,
  currentSensors,
  maxSensors,
  accentColor,
  onSensorsUpdate,
}: SensorGroupSettingsDialogProps) {
  const colors = SENSOR_GROUP_COLOR_MAP[accentColor];
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const controller = useSensorGroupSettings({
    currentSensors,
    maxSensors,
    onClose,
    onSensorsUpdate,
  });

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          controller.handleCancel();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className={`fixed inset-0 z-50 animate-in fade-in ${surface.dialogBackdrop}`}
        />
        <SensorGroupSettingsView
          groupName={groupName}
          selectedSensors={controller.selectedSensors}
          maxSensors={maxSensors}
          searchQuery={controller.searchQuery}
          setSearchQuery={controller.setSearchQuery}
          isDropdownOpen={controller.isDropdownOpen}
          setIsDropdownOpen={controller.setIsDropdownOpen}
          highlightedIndex={controller.highlightedIndex}
          setHighlightedIndex={controller.setHighlightedIndex}
          inputRef={controller.inputRef}
          colors={colors}
          theme={theme}
          filteredSensors={controller.filteredSensors}
          iconMap={iconMap}
          handleAddSensor={controller.handleAddSensor}
          handleRemoveSensor={controller.handleRemoveSensor}
          handleSave={controller.handleSave}
          handleCancel={controller.handleCancel}
          isSensorSelected={controller.isSensorSelected}
          CustomScrollbar={CustomScrollbar}
        />
      </Dialog.Portal>
    </Dialog.Root>
  );
});
