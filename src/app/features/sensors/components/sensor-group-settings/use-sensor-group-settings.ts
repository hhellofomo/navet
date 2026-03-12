import { useCallback, useRef, useState } from 'react';
import type { SensorReading } from '../sensors';
import { AVAILABLE_SENSORS } from './data';
import type { AvailableSensor, SensorGroupSettingsDialogProps } from './types';

export function useSensorGroupSettings({
  currentSensors,
  maxSensors,
  onClose,
  onSensorsUpdate,
}: Pick<
  SensorGroupSettingsDialogProps,
  'currentSensors' | 'maxSensors' | 'onClose' | 'onSensorsUpdate'
>) {
  const [selectedSensors, setSelectedSensors] = useState<SensorReading[]>(currentSensors);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredSensors = AVAILABLE_SENSORS.filter((sensor) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return true;
    }
    return (
      sensor.label.toLowerCase().includes(query) ||
      sensor.category.toLowerCase().includes(query) ||
      sensor.unit.toLowerCase().includes(query) ||
      sensor.id.toLowerCase().includes(query)
    );
  });

  const isSensorSelected = useCallback(
    (sensorId: string) =>
      selectedSensors.some((sensor) =>
        AVAILABLE_SENSORS.find(
          (available) => available.id === sensorId && available.label === sensor.label
        )
      ),
    [selectedSensors]
  );

  const handleAddSensor = useCallback(
    (sensor: AvailableSensor) => {
      if (selectedSensors.length >= maxSensors) {
        return;
      }

      const alreadySelected = selectedSensors.some((current) =>
        AVAILABLE_SENSORS.find(
          (available) => available.id === sensor.id && available.label === current.label
        )
      );
      if (alreadySelected) {
        return;
      }

      setSelectedSensors([
        ...selectedSensors,
        {
          id: sensor.id,
          label: sensor.label,
          value: sensor.value,
          unit: sensor.unit,
          icon: sensor.icon,
        },
      ]);
      setSearchQuery('');
      setHighlightedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [maxSensors, selectedSensors]
  );

  const handleRemoveSensor = useCallback((index: number) => {
    setSelectedSensors((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }, []);

  const resetState = useCallback(() => {
    setSelectedSensors(currentSensors);
    setSearchQuery('');
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  }, [currentSensors]);

  const handleCancel = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const handleSave = useCallback(() => {
    onSensorsUpdate(selectedSensors);
    onClose();
  }, [onClose, onSensorsUpdate, selectedSensors]);

  return {
    filteredSensors,
    handleAddSensor,
    handleCancel,
    handleRemoveSensor,
    handleSave,
    highlightedIndex,
    inputRef,
    isDropdownOpen,
    isSensorSelected,
    searchQuery,
    selectedSensors,
    setHighlightedIndex,
    setIsDropdownOpen,
    setSearchQuery,
  };
}
