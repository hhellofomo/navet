import type { LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { type CardSize, isExtraSmallCardSize } from '@/app/components/shared/card-size-selector';
import { useEntityCardInteractionController } from '@/app/components/shared/entity-card-interaction-controller';
import { DEFAULT_LIGHT_ICON, LIGHT_ICON_MAP } from '@/app/constants/icon-map';
import { TEMP_OPTIONS } from '@/app/constants/light-constants';
import { useHomeAssistant, useI18n, useTheme } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import { homeAssistantSelectors } from '@/app/stores/selectors';
import { getGradientColors } from '@/app/utils/color-utils';
import { useBrightnessPresets } from '../../hooks/use-brightness-presets';
import { useLightMemoryStore } from '../../stores/light-memory-store';
import { type BrightnessPresetKey, useLightPresetStore } from '../../stores/light-preset-store';
import type { HeaderIconButtonProps, LightBrightnessPreset } from './light-card-types';
import {
  clampKelvin,
  clampPercentage,
  getBrightnessPercent,
  getReportedColorHex,
  getReportedColorTempKelvin,
  getSupportedColorTemperatureRange,
  roundKelvin,
  supportsColorSelection,
  supportsColorTemperatureControl,
} from './light-card-utils';

interface LightCardControllerParams {
  id: string;
  name: string;
  room: string;
  initialState: boolean;
  initialBrightness: number;
  initialTemp: number;
  size: CardSize;
  isEditMode: boolean;
}

export interface LightCardController {
  applyBrightnessPresetsToAll: boolean;
  brightness: number;
  brightnessPresets: LightBrightnessPreset[];
  cardInteraction: ReturnType<typeof useEntityCardInteractionController>;
  colorTemp: number;
  currentColor: string;
  customColor: string;
  gradientColors: ReturnType<typeof getGradientColors>;
  iconButtonProps: HeaderIconButtonProps;
  IconComponent: LucideIcon;
  isOn: boolean;
  isOpen: boolean;
  maxColorTemp: number;
  minColorTemp: number;
  padding: string;
  selectedColor: string | null;
  selectedIcon: string;
  settingsButtonProps: HeaderIconButtonProps;
  showPresetOverflow: boolean;
  showSettingsButton: boolean;
  supportsColorControl: boolean;
  supportsColorTemperature: boolean;
  tempOptions: Array<{ value: number; color: string; label: string }>;
  onApplyBrightnessPresetsToAllChange: (applyToAll: boolean) => void;
  onBrightnessChange: (value: number) => void;
  onBrightnessCommit: (value: number) => void;
  onBrightnessPresetOrderChange: (keys: BrightnessPresetKey[]) => void;
  onBrightnessPresetValueChange: (key: BrightnessPresetKey, value: number) => void;
  onColorChange: (color: string) => void;
  onCustomColorChange: (color: string) => void;
  onIconChange: (icon: string) => void;
  onOpenChange: (open: boolean) => void;
  onTempChange: (temp: number) => void;
  onTempCommit: (temp: number) => void;
}

export function useLightCardController({
  id,
  name,
  room: _room,
  initialState,
  initialBrightness,
  initialTemp,
  size,
  isEditMode,
}: LightCardControllerParams): LightCardController {
  const [isOn, setIsOn] = useState(initialState);
  const [brightness, setBrightness] = useState(initialBrightness);
  const [isAdjustingBrightness, setIsAdjustingBrightness] = useState(false);
  const [colorTemp, setColorTemp] = useState(roundKelvin(initialTemp));
  const [isAdjustingTemp, setIsAdjustingTemp] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState('#FFA500');
  const [isOpen, setIsOpen] = useState(false);
  const [applyBrightnessPresetsToAll, setApplyBrightnessPresetsToAll] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_LIGHT_ICON);
  const connection = useHomeAssistant(homeAssistantSelectors.connection);
  const entities = useHomeAssistant(homeAssistantSelectors.entities);
  const { theme } = useTheme();
  const { t } = useI18n();
  const brightnessPresets = useBrightnessPresets(id);
  const rememberLightState = useLightMemoryStore((state) => state.rememberState);
  const setBrightnessPresetValue = useLightPresetStore((state) => state.setBrightnessPresetValue);
  const setBrightnessPresetOrder = useLightPresetStore((state) => state.setBrightnessPresetOrder);
  const liveEntity = entities?.[id];
  const rememberedLightState = useLightMemoryStore.getState().getRememberedState(id);
  const lastBrightnessRef = useRef(
    rememberedLightState?.brightness ?? (initialBrightness > 0 ? initialBrightness : 100)
  );
  const lastColorTempRef = useRef(rememberedLightState?.colorTemp ?? roundKelvin(initialTemp));
  const pendingBrightnessRef = useRef<number | null>(null);
  const brightnessSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingStateRef = useRef<boolean | null>(null);
  const stateSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTempRef = useRef<number | null>(null);
  const tempSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastKnownColorRef = useRef<string | null>(null);

  const effectiveSelectedColor = selectedColor ?? (isOn ? lastKnownColorRef.current : null);
  const gradientColors = getGradientColors(isOn, effectiveSelectedColor, theme);
  const IconComponent = LIGHT_ICON_MAP[selectedIcon] || LIGHT_ICON_MAP[DEFAULT_LIGHT_ICON];
  const isHomeAssistantLight = Boolean(connection) && id.startsWith('light.');
  const supportsColorTemperature = supportsColorTemperatureControl(liveEntity);
  const supportsColorControl = supportsColorSelection(liveEntity);
  const { max: maxColorTemp, min: minColorTemp } = getSupportedColorTemperatureRange(liveEntity);
  const tempOptions = TEMP_OPTIONS.filter(
    (option) => option.value >= minColorTemp && option.value <= maxColorTemp
  );

  const isExtraSmall = isExtraSmallCardSize(size);
  const isSmall = isExtraSmall || size === 'small';
  const padding = isExtraSmall ? 'px-3.5 pt-3 pb-4' : isSmall ? 'p-4' : 'p-5';

  useEffect(() => {
    if (liveEntity) {
      return;
    }
    setIsOn(initialState);
  }, [initialState, liveEntity]);

  useEffect(() => {
    if (liveEntity) {
      return;
    }
    setBrightness(initialBrightness);
    if (initialBrightness > 0) {
      lastBrightnessRef.current = initialBrightness;
      rememberLightState(id, { brightness: initialBrightness });
    }
  }, [id, initialBrightness, liveEntity, rememberLightState]);

  useEffect(() => {
    if (liveEntity) {
      return;
    }
    const nextTemp = roundKelvin(initialTemp);
    setColorTemp(nextTemp);
    lastColorTempRef.current = nextTemp;
    rememberLightState(id, { colorTemp: nextTemp });
  }, [id, initialTemp, liveEntity, rememberLightState]);

  useEffect(() => {
    if (!liveEntity) {
      return;
    }

    const nextIsOn = liveEntity.state === 'on';
    if (pendingStateRef.current !== null && nextIsOn !== pendingStateRef.current) {
      return;
    }

    if (pendingStateRef.current !== null) {
      pendingStateRef.current = null;
      if (stateSyncTimeoutRef.current) {
        clearTimeout(stateSyncTimeoutRef.current);
        stateSyncTimeoutRef.current = null;
      }
    }

    setIsOn(nextIsOn);
  }, [liveEntity]);

  useEffect(() => {
    if (!liveEntity || isAdjustingBrightness || liveEntity.state !== 'on') {
      return;
    }

    const brightnessFromEntity = getBrightnessPercent(liveEntity);
    if (
      pendingBrightnessRef.current !== null &&
      Math.abs(brightnessFromEntity - pendingBrightnessRef.current) > 1
    ) {
      return;
    }

    if (pendingBrightnessRef.current !== null) {
      pendingBrightnessRef.current = null;
      if (brightnessSyncTimeoutRef.current) {
        clearTimeout(brightnessSyncTimeoutRef.current);
        brightnessSyncTimeoutRef.current = null;
      }
    }

    if (brightnessFromEntity > 0) {
      lastBrightnessRef.current = brightnessFromEntity;
      rememberLightState(id, { brightness: brightnessFromEntity });
    }

    setBrightness(brightnessFromEntity);
  }, [id, isAdjustingBrightness, liveEntity, rememberLightState]);

  useEffect(() => {
    return () => {
      if (brightnessSyncTimeoutRef.current) {
        clearTimeout(brightnessSyncTimeoutRef.current);
      }
      if (stateSyncTimeoutRef.current) {
        clearTimeout(stateSyncTimeoutRef.current);
      }
      if (tempSyncTimeoutRef.current) {
        clearTimeout(tempSyncTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (liveEntity) {
      if (isAdjustingTemp || liveEntity.state !== 'on') {
        return;
      }

      const entityTemp = getReportedColorTempKelvin(liveEntity);
      if (entityTemp === null) {
        return;
      }
      if (pendingTempRef.current !== null && Math.abs(entityTemp - pendingTempRef.current) > 100) {
        return;
      }

      if (pendingTempRef.current !== null) {
        pendingTempRef.current = null;
        if (tempSyncTimeoutRef.current) {
          clearTimeout(tempSyncTimeoutRef.current);
          tempSyncTimeoutRef.current = null;
        }
      }

      const nextTemp = clampKelvin(entityTemp, minColorTemp, maxColorTemp);
      lastColorTempRef.current = nextTemp;
      rememberLightState(id, { colorTemp: nextTemp });
      setColorTemp(nextTemp);
      return;
    }

    if (isAdjustingTemp) {
      return;
    }

    if (pendingTempRef.current !== null && Math.abs(initialTemp - pendingTempRef.current) > 100) {
      return;
    }

    if (pendingTempRef.current !== null) {
      pendingTempRef.current = null;
      if (tempSyncTimeoutRef.current) {
        clearTimeout(tempSyncTimeoutRef.current);
        tempSyncTimeoutRef.current = null;
      }
    }

    const nextTemp = roundKelvin(initialTemp);
    lastColorTempRef.current = nextTemp;
    rememberLightState(id, { colorTemp: nextTemp });
    setColorTemp(nextTemp);
  }, [
    id,
    initialTemp,
    isAdjustingTemp,
    liveEntity,
    maxColorTemp,
    minColorTemp,
    rememberLightState,
  ]);

  useEffect(() => {
    if (!liveEntity || liveEntity.state !== 'on' || isAdjustingTemp) {
      return;
    }

    const reportedColor = getReportedColorHex(liveEntity);
    setSelectedColor(reportedColor);
    if (reportedColor) {
      lastKnownColorRef.current = reportedColor;
      setCustomColor(reportedColor);
    }
  }, [isAdjustingTemp, liveEntity]);

  const syncLightWithHomeAssistant = useCallback(
    async (options: {
      state?: 'on' | 'off';
      brightnessPct?: number;
      kelvin?: number;
      rgbColor?: [number, number, number];
    }) => {
      if (!isHomeAssistantLight) {
        return;
      }

      try {
        await homeAssistantService.updateLight(id, options);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : t('lighting.feedback.updateLightFailed')
        );
        throw error;
      }
    },
    [id, isHomeAssistantLight, t]
  );

  const schedulePendingStateReset = useCallback((nextIsOn: boolean, delayMs = 1500) => {
    pendingStateRef.current = nextIsOn;
    if (stateSyncTimeoutRef.current) {
      clearTimeout(stateSyncTimeoutRef.current);
    }
    stateSyncTimeoutRef.current = setTimeout(() => {
      pendingStateRef.current = null;
      stateSyncTimeoutRef.current = null;
    }, delayMs);
  }, []);

  const hexToRgb = useCallback((hex: string): [number, number, number] | null => {
    const normalized = hex.replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
      return null;
    }

    return [
      parseInt(normalized.slice(0, 2), 16),
      parseInt(normalized.slice(2, 4), 16),
      parseInt(normalized.slice(4, 6), 16),
    ];
  }, []);

  const onBrightnessChange = useCallback(
    (value: number) => {
      const nextBrightness = clampPercentage(value, 1);
      setIsAdjustingBrightness(true);
      setBrightness(nextBrightness);
      lastBrightnessRef.current = nextBrightness;
      rememberLightState(id, { brightness: nextBrightness });
      if (!isOn) {
        setIsOn(true);
        schedulePendingStateReset(true);
        void syncLightWithHomeAssistant({ state: 'on', brightnessPct: nextBrightness }).catch(
          () => {
            pendingStateRef.current = null;
            if (stateSyncTimeoutRef.current) {
              clearTimeout(stateSyncTimeoutRef.current);
              stateSyncTimeoutRef.current = null;
            }
            setIsOn(false);
          }
        );
        return;
      }

      void syncLightWithHomeAssistant({ state: 'on', brightnessPct: nextBrightness });
    },
    [id, isOn, rememberLightState, schedulePendingStateReset, syncLightWithHomeAssistant]
  );

  const onBrightnessCommit = useCallback(
    (value: number) => {
      const nextBrightness = clampPercentage(value, 1);
      setBrightness(nextBrightness);
      lastBrightnessRef.current = nextBrightness;
      rememberLightState(id, { brightness: nextBrightness });
      setIsAdjustingBrightness(false);
      pendingBrightnessRef.current = nextBrightness;
      if (brightnessSyncTimeoutRef.current) {
        clearTimeout(brightnessSyncTimeoutRef.current);
      }
      brightnessSyncTimeoutRef.current = setTimeout(() => {
        pendingBrightnessRef.current = null;
        brightnessSyncTimeoutRef.current = null;
      }, 1500);
      if (!isOn) {
        setIsOn(true);
      }
      void syncLightWithHomeAssistant({ state: 'on', brightnessPct: nextBrightness });
    },
    [id, isOn, rememberLightState, syncLightWithHomeAssistant]
  );

  const onTempChange = useCallback(
    (temp: number) => {
      const nextTemp = clampKelvin(temp, minColorTemp, maxColorTemp);
      setIsAdjustingTemp(true);
      setColorTemp(nextTemp);
      lastColorTempRef.current = nextTemp;
      rememberLightState(id, { colorTemp: nextTemp });
      setSelectedColor(null);
      lastKnownColorRef.current = null;
      if (!isOn) {
        setIsOn(true);
      }
    },
    [id, isOn, maxColorTemp, minColorTemp, rememberLightState]
  );

  const onTempCommit = useCallback(
    (temp: number) => {
      const nextTemp = clampKelvin(temp, minColorTemp, maxColorTemp);
      setColorTemp(nextTemp);
      lastColorTempRef.current = nextTemp;
      rememberLightState(id, { colorTemp: nextTemp });
      setIsAdjustingTemp(false);
      pendingTempRef.current = nextTemp;
      if (tempSyncTimeoutRef.current) {
        clearTimeout(tempSyncTimeoutRef.current);
      }
      tempSyncTimeoutRef.current = setTimeout(() => {
        pendingTempRef.current = null;
        tempSyncTimeoutRef.current = null;
      }, 1500);
      setSelectedColor(null);
      lastKnownColorRef.current = null;
      if (!isOn) {
        setIsOn(true);
      }
      void syncLightWithHomeAssistant({ state: 'on', kelvin: nextTemp });
    },
    [id, isOn, maxColorTemp, minColorTemp, rememberLightState, syncLightWithHomeAssistant]
  );

  const onColorChange = useCallback(
    (color: string) => {
      setSelectedColor(color);
      lastKnownColorRef.current = color;
      if (!isOn) {
        setIsOn(true);
      }

      const rgbColor = hexToRgb(color);
      if (rgbColor) {
        void syncLightWithHomeAssistant({ state: 'on', rgbColor });
      }
    },
    [hexToRgb, isOn, syncLightWithHomeAssistant]
  );

  const toggleLightState = useCallback(
    (nextIsOn: boolean) => {
      const latestRememberedState = useLightMemoryStore.getState().getRememberedState(id);
      const brightnessToRestore =
        latestRememberedState?.brightness !== undefined
          ? clampPercentage(latestRememberedState.brightness, 1)
          : brightness > 0
            ? brightness
            : Math.max(1, Math.round(lastBrightnessRef.current));
      const colorTempToRestore = clampKelvin(lastColorTempRef.current, minColorTemp, maxColorTemp);
      const rememberedColorTemp =
        latestRememberedState?.colorTemp !== undefined
          ? clampKelvin(latestRememberedState.colorTemp, minColorTemp, maxColorTemp)
          : colorTempToRestore;

      setIsOn(nextIsOn);
      if (nextIsOn) {
        setBrightness(brightnessToRestore);
        setColorTemp(rememberedColorTemp);
        pendingBrightnessRef.current = brightnessToRestore;
        pendingTempRef.current = rememberedColorTemp;
        if (brightnessSyncTimeoutRef.current) {
          clearTimeout(brightnessSyncTimeoutRef.current);
        }
        if (tempSyncTimeoutRef.current) {
          clearTimeout(tempSyncTimeoutRef.current);
        }
        brightnessSyncTimeoutRef.current = setTimeout(() => {
          pendingBrightnessRef.current = null;
          brightnessSyncTimeoutRef.current = null;
        }, 2500);
        tempSyncTimeoutRef.current = setTimeout(() => {
          pendingTempRef.current = null;
          tempSyncTimeoutRef.current = null;
        }, 2500);
      }
      schedulePendingStateReset(nextIsOn);

      void syncLightWithHomeAssistant({
        state: nextIsOn ? 'on' : 'off',
        brightnessPct: nextIsOn ? brightnessToRestore : undefined,
        kelvin: nextIsOn && !selectedColor ? rememberedColorTemp : undefined,
      }).catch(() => {
        pendingStateRef.current = null;
        if (stateSyncTimeoutRef.current) {
          clearTimeout(stateSyncTimeoutRef.current);
          stateSyncTimeoutRef.current = null;
        }
        setIsOn(!nextIsOn);
      });
    },
    [
      brightness,
      id,
      maxColorTemp,
      minColorTemp,
      schedulePendingStateReset,
      selectedColor,
      syncLightWithHomeAssistant,
    ]
  );

  const handleSettingsClick = useCallback(() => {
    setIsOpen(true);
  }, []);

  const cardInteraction = useEntityCardInteractionController({
    ariaLabel: `${name} ${t('lighting.type.light').toLowerCase()}`,
    ariaPressed: isOn,
    isEditMode,
    onToggle: () => toggleLightState(!isOn),
    onOpenControls: handleSettingsClick,
    onOpenSettings: handleSettingsClick,
  });

  const showSettingsButton = cardInteraction.interactionMode !== 'control-first';
  const showPresetOverflow = showSettingsButton || isSmall;
  const onCustomColorChange = useCallback(
    (color: string) => {
      setCustomColor(color);
      onColorChange(color);
    },
    [onColorChange]
  );

  return {
    applyBrightnessPresetsToAll,
    brightness,
    brightnessPresets,
    cardInteraction,
    colorTemp,
    currentColor: effectiveSelectedColor ?? customColor,
    customColor,
    gradientColors,
    iconButtonProps: cardInteraction.iconButtonProps,
    IconComponent,
    isOn,
    isOpen,
    maxColorTemp,
    minColorTemp,
    onApplyBrightnessPresetsToAllChange: setApplyBrightnessPresetsToAll,
    onBrightnessChange,
    onBrightnessCommit,
    onBrightnessPresetOrderChange: (keys) =>
      setBrightnessPresetOrder(id, keys, applyBrightnessPresetsToAll),
    onBrightnessPresetValueChange: (key, value) =>
      setBrightnessPresetValue(id, key, value, applyBrightnessPresetsToAll),
    onColorChange,
    onCustomColorChange,
    onIconChange: setSelectedIcon,
    onOpenChange: setIsOpen,
    onTempChange,
    onTempCommit,
    padding,
    selectedColor: effectiveSelectedColor,
    selectedIcon,
    settingsButtonProps: cardInteraction.settingsButtonProps,
    showPresetOverflow,
    showSettingsButton,
    supportsColorControl,
    supportsColorTemperature,
    tempOptions,
  };
}
