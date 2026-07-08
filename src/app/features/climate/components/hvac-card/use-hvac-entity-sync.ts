import type { HassEntity } from 'home-assistant-js-websocket';
import { type Dispatch, type SetStateAction, useEffect } from 'react';

interface UseHvacEntitySyncParams {
  liveEntity: HassEntity | undefined;
  initialTemp: number;
  initialCurrentTemp: number;
  initialMode: string;
  initialAction?: string;
  initialSupportedHvacModes?: string[];
  initialState: boolean;
  setTargetTemp: Dispatch<SetStateAction<number>>;
  setCurrentTemp: Dispatch<SetStateAction<number>>;
  setMode: Dispatch<SetStateAction<string>>;
  setAction: Dispatch<SetStateAction<string | undefined>>;
  setSupportedHvacModes: Dispatch<SetStateAction<string[] | undefined>>;
  setIsOn: Dispatch<SetStateAction<boolean>>;
}

function parseSupportedHvacModes(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.filter((mode): mode is string => typeof mode === 'string');
}

function resolveMode(liveEntity: HassEntity, attrs: Record<string, unknown>, initialMode: string) {
  if (typeof attrs.hvac_mode === 'string') {
    return attrs.hvac_mode;
  }

  if (typeof attrs.operation_mode === 'string') {
    return attrs.operation_mode;
  }

  return typeof liveEntity.state === 'string' && liveEntity.state ? liveEntity.state : initialMode;
}

function resolveSupportedModes(liveEntity: HassEntity, attrs: Record<string, unknown>) {
  const supportedModes = parseSupportedHvacModes(attrs.hvac_modes ?? attrs.operation_list);
  return liveEntity.entity_id.startsWith('water_heater.') ? (supportedModes ?? []) : supportedModes;
}

export function useHvacEntitySync({
  liveEntity,
  initialTemp,
  initialCurrentTemp,
  initialMode,
  initialAction,
  initialSupportedHvacModes,
  initialState,
  setTargetTemp,
  setCurrentTemp,
  setMode,
  setAction,
  setSupportedHvacModes,
  setIsOn,
}: UseHvacEntitySyncParams) {
  useEffect(() => {
    if (liveEntity) {
      const attrs = liveEntity.attributes as Record<string, unknown>;
      setIsOn(liveEntity.state !== 'off');
      setMode(resolveMode(liveEntity, attrs, initialMode));
      setAction(typeof attrs.hvac_action === 'string' ? attrs.hvac_action : initialAction);
      setSupportedHvacModes(resolveSupportedModes(liveEntity, attrs));
      if (typeof attrs.temperature === 'number') setTargetTemp(attrs.temperature);
      if (typeof attrs.current_temperature === 'number') setCurrentTemp(attrs.current_temperature);
      return;
    }
    setTargetTemp(initialTemp);
    setCurrentTemp(initialCurrentTemp);
    setMode(initialMode);
    setAction(initialAction);
    setSupportedHvacModes(initialSupportedHvacModes);
    setIsOn(initialState);
  }, [
    liveEntity,
    initialTemp,
    initialCurrentTemp,
    initialMode,
    initialAction,
    initialSupportedHvacModes,
    initialState,
    setTargetTemp,
    setCurrentTemp,
    setMode,
    setAction,
    setSupportedHvacModes,
    setIsOn,
  ]);
}
