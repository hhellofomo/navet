import { useState, useCallback } from 'react';

export interface DeviceState {
  isOn: boolean;
  brightness?: number;
  colorTemp?: number;
  selectedColor?: string | null;
  customColor?: string;
  selectedIcon?: string;
}

export function useDeviceState(initialState: Partial<DeviceState> = {}) {
  const [state, setState] = useState<DeviceState>({
    isOn: initialState.isOn ?? true,
    brightness: initialState.brightness ?? 80,
    colorTemp: initialState.colorTemp ?? 4000,
    selectedColor: initialState.selectedColor ?? null,
    customColor: initialState.customColor ?? '#FFA500',
    selectedIcon: initialState.selectedIcon ?? 'Zap',
  });

  const updateState = useCallback(<K extends keyof DeviceState>(
    key: K,
    value: DeviceState[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const togglePower = useCallback(() => {
    setState(prev => ({ ...prev, isOn: !prev.isOn }));
  }, []);

  return {
    state,
    updateState,
    togglePower,
  };
}
