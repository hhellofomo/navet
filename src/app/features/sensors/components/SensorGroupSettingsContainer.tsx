import * as Dialog from '@radix-ui/react-dialog';
import { memo } from 'react';
import { CustomScrollbar } from '@/app/components/shared/custom-scrollbar';
import { SensorGroupSettingsView } from './SensorGroupSettingsView';
import { SENSOR_GROUP_COLOR_MAP } from './sensor-group-settings.data';
import type { SensorGroupSettingsDialogProps } from './sensor-group-settings.types';
import { iconMap } from './sensors/sensor-types';
import { useSensorGroupSettings } from './use-sensor-group-settings';

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
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
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
