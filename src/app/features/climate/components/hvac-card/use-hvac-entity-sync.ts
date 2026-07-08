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
      setMode(typeof attrs.hvac_mode === 'string' ? attrs.hvac_mode : initialMode);
      setAction(typeof attrs.hvac_action === 'string' ? attrs.hvac_action : initialAction);
      setSupportedHvacModes(parseSupportedHvacModes(attrs.hvac_modes));
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
