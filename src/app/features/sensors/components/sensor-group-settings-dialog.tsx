import { memo } from 'react';
import { SensorGroupSettingsContainer } from './SensorGroupSettingsContainer';
import type { SensorGroupSettingsDialogProps } from './sensor-group-settings.types';

export const SensorGroupSettingsDialog = memo(function SensorGroupSettingsDialog(
  props: SensorGroupSettingsDialogProps
) {
  return <SensorGroupSettingsContainer {...props} />;
});
