import type { HassEntity } from 'home-assistant-js-websocket';
import { Settings2 } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { useEntityCardInteractionController } from '@/app/components/shared/entity-card-interaction-controller';
import { DEFAULT_LIGHT_ICON, LIGHT_ICON_MAP } from '@/app/constants/icon-map';
import { TEMP_OPTIONS } from '@/app/constants/light-constants';
import { useHomeAssistantContext } from '@/app/contexts/home-assistant-context';
import { useTheme } from '@/app/contexts/theme-context';
import { useBrightnessPresets } from '@/app/hooks/use-brightness-presets';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import { useLightMemoryStore } from '@/app/stores/light-memory-store';
import { useLightPresetStore } from '@/app/stores/light-preset-store';
import { getGradientColors } from '@/app/utils/color-utils';
import { LightCardLarge } from './light-card-large';
import { LightCardMedium } from './light-card-medium';
import { LightCardSmall } from './light-card-small';
import { LightSettingsDialog } from './light-settings-dialog';

interface LightCardProps {
  id: string;
  name: string;
  room: string;
  initialState?: boolean;
  initialBrightness?: number;
  initialTemp?: number;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

export const LightCard = memo(function LightCard({
  id,
  name,
  room,
  initialState = false,
  initialBrightness = 0,
  initialTemp = 4000,
  size,
  onSizeChange,
  isEditMode,
}: LightCardProps) {
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
  const { connection, entities } = useHomeAssistantContext();
  const { theme } = useTheme();
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

  const isSmall = size === 'extra-small' || size === 'small';
  const isMedium = size === 'medium';
  const padding = isSmall ? 'p-4' : 'p-5';
  const settingsButtonSize = isSmall ? 'w-7 h-7' : 'w-8 h-8';
  const settingsIconSize = isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const settingsButtonBg =
    theme === 'light' ? 'bg-gray-900/15 hover:bg-gray-900/25' : 'bg-white/10 hover:bg-white/20';
  const settingsButtonText = theme === 'light' ? 'text-gray-900' : 'text-white';

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
    if (!liveEntity) {
      return;
    }

    if (isAdjustingBrightness) {
      return;
    }

    if (liveEntity.state !== 'on') {
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
      if (isAdjustingTemp) {
        return;
      }

      if (liveEntity.state !== 'on') {
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
        toast.error(error instanceof Error ? error.message : 'Failed to update light');
        throw error;
      }
    },
    [id, isHomeAssistantLight]
  );

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

  const handleBrightnessChange = useCallback(
    (value: number) => {
      const nextBrightness = clampPercentage(value, 1);
      setIsAdjustingBrightness(true);
      setBrightness(nextBrightness);
      lastBrightnessRef.current = nextBrightness;
      rememberLightState(id, { brightness: nextBrightness });
      if (!isOn) setIsOn(true);
    },
    [id, isOn, rememberLightState]
  );

  const handleBrightnessCommit = useCallback(
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
      if (!isOn) setIsOn(true);
      void syncLightWithHomeAssistant({
        state: 'on',
        brightnessPct: nextBrightness,
      });
    },
    [id, isOn, rememberLightState, syncLightWithHomeAssistant]
  );

  const handleTempChange = useCallback(
    (temp: number) => {
      const nextTemp = clampKelvin(temp, minColorTemp, maxColorTemp);
      setIsAdjustingTemp(true);
      setColorTemp(nextTemp);
      lastColorTempRef.current = nextTemp;
      rememberLightState(id, { colorTemp: nextTemp });
      setSelectedColor(null);
      lastKnownColorRef.current = null;
      if (!isOn) setIsOn(true);
    },
    [id, isOn, maxColorTemp, minColorTemp, rememberLightState]
  );

  const handleTempCommit = useCallback(
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
      if (!isOn) setIsOn(true);
      void syncLightWithHomeAssistant({
        state: 'on',
        kelvin: nextTemp,
      });
    },
    [id, isOn, maxColorTemp, minColorTemp, rememberLightState, syncLightWithHomeAssistant]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      setSelectedColor(color);
      lastKnownColorRef.current = color;
      if (!isOn) setIsOn(true);

      const rgbColor = hexToRgb(color);
      if (rgbColor) {
        void syncLightWithHomeAssistant({
          state: 'on',
          rgbColor,
        });
      }
    },
    [hexToRgb, isOn, syncLightWithHomeAssistant]
  );

  const handleSettingsClick = useCallback(() => {
    setIsOpen(true);
  }, []);

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
      pendingStateRef.current = nextIsOn;
      if (stateSyncTimeoutRef.current) {
        clearTimeout(stateSyncTimeoutRef.current);
      }
      stateSyncTimeoutRef.current = setTimeout(() => {
        pendingStateRef.current = null;
        stateSyncTimeoutRef.current = null;
      }, 1500);

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
    [brightness, id, maxColorTemp, minColorTemp, selectedColor, syncLightWithHomeAssistant]
  );

  const cardInteraction = useEntityCardInteractionController({
    ariaLabel: `${name} light`,
    ariaPressed: isOn,
    isEditMode,
    onToggle: () => toggleLightState(!isOn),
    onOpenControls: handleSettingsClick,
    onOpenSettings: handleSettingsClick,
  });
  const showSettingsButton = cardInteraction.interactionMode !== 'control-first';
  const showPresetOverflow = showSettingsButton || isSmall;

  const handleCustomColorChange = useCallback(
    (color: string) => {
      setCustomColor(color);
      handleColorChange(color);
    },
    [handleColorChange]
  );

  return (
    <>
      <div
        {...cardInteraction.cardProps}
        className={`relative h-full w-full backdrop-blur-xl rounded-3xl ${padding} border overflow-hidden transition-all duration-500 ${!isEditMode ? 'cursor-pointer' : ''} ${
          gradientColors.customGradient
            ? ''
            : `bg-gradient-to-br ${gradientColors.from} ${gradientColors.to} ${gradientColors.border}`
        } ${!isOn ? 'grayscale opacity-40' : ''} ${theme === 'light' && isOn ? 'shadow-lg' : ''}`}
        style={
          gradientColors.customGradient
            ? {
                background: gradientColors.customGradient,
                borderColor: effectiveSelectedColor ? `${effectiveSelectedColor}66` : undefined,
              }
            : {}
        }
      >
        {!isEditMode && !isSmall && !isMedium && showSettingsButton && (
          <button
            {...cardInteraction.settingsButtonProps}
            className={`absolute right-3 bottom-3 z-20 ${settingsButtonSize} rounded-full ${settingsButtonBg} transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer`}
          >
            <Settings2 className={`${settingsIconSize} ${settingsButtonText}`} />
          </button>
        )}

        {isEditMode && (
          <CardSizeSelector
            currentSize={size}
            onSizeChange={(newSize) => onSizeChange(id, newSize)}
          />
        )}

        {/* Glow effect when on */}
        {isOn && (
          <div
            className={`absolute -inset-[100%] blur-3xl ${theme === 'light' ? 'opacity-40' : 'opacity-20'}`}
            style={{
              background: `radial-gradient(circle, ${gradientColors.glow || 'transparent'} 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Light theme frosted overlay - warm tint when on, neutral when off */}
        {theme === 'light' && (
          <div
            className="absolute inset-0"
            style={
              isOn
                ? {
                    background: effectiveSelectedColor
                      ? `linear-gradient(135deg, ${effectiveSelectedColor}2e 0%, rgba(255, 255, 255, 0.38) 100%)`
                      : 'rgba(255, 251, 235, 0.3)',
                  }
                : { background: 'rgba(255, 255, 255, 0.6)' }
            }
          />
        )}

        {theme !== 'light' && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        )}

        <div className="relative h-full flex flex-col">
          {isSmall ? (
            <LightCardSmall
              name={name}
              room={room}
              brightness={brightness}
              currentColor={effectiveSelectedColor ?? customColor}
              brightnessPresets={brightnessPresets}
              isOn={isOn}
              IconComponent={IconComponent}
              iconButtonProps={cardInteraction.iconButtonProps}
              settingsButtonProps={cardInteraction.settingsButtonProps}
              showSettingsButton={showSettingsButton}
              showPresetOverflow={showPresetOverflow}
              supportsColorControl={supportsColorControl}
              onBrightnessChange={handleBrightnessChange}
              onBrightnessCommit={handleBrightnessCommit}
              onColorChange={handleColorChange}
            />
          ) : isMedium ? (
            <LightCardMedium
              name={name}
              brightness={brightness}
              currentColor={effectiveSelectedColor ?? customColor}
              brightnessPresets={brightnessPresets}
              isOn={isOn}
              IconComponent={IconComponent}
              iconButtonProps={cardInteraction.iconButtonProps}
              settingsButtonProps={cardInteraction.settingsButtonProps}
              showSettingsButton={showSettingsButton}
              showPresetOverflow={showPresetOverflow}
              supportsColorControl={supportsColorControl}
              onBrightnessChange={handleBrightnessChange}
              onBrightnessCommit={handleBrightnessCommit}
              onColorChange={handleColorChange}
            />
          ) : (
            <LightCardLarge
              name={name}
              brightness={brightness}
              brightnessPresets={brightnessPresets}
              selectedColor={effectiveSelectedColor}
              currentColor={effectiveSelectedColor ?? customColor}
              isOn={isOn}
              IconComponent={IconComponent}
              iconButtonProps={cardInteraction.iconButtonProps}
              supportsColorControl={supportsColorControl}
              onBrightnessChange={handleBrightnessChange}
              onBrightnessCommit={handleBrightnessCommit}
              onColorChange={handleColorChange}
            />
          )}
        </div>
      </div>

      <LightSettingsDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        name={name}
        room={room}
        isOn={isOn}
        supportsColorTemperature={supportsColorTemperature}
        supportsColorControl={supportsColorControl}
        minColorTemp={minColorTemp}
        maxColorTemp={maxColorTemp}
        colorTemp={colorTemp}
        brightnessPresets={brightnessPresets}
        selectedColor={effectiveSelectedColor}
        customColor={customColor}
        brightness={brightness}
        selectedIcon={selectedIcon}
        tempOptions={tempOptions}
        onTempChange={handleTempChange}
        onTempCommit={handleTempCommit}
        onColorChange={handleColorChange}
        onCustomColorChange={handleCustomColorChange}
        onBrightnessChange={handleBrightnessCommit}
        applyBrightnessPresetsToAll={applyBrightnessPresetsToAll}
        onApplyBrightnessPresetsToAllChange={setApplyBrightnessPresetsToAll}
        onBrightnessPresetValueChange={(key, value) =>
          setBrightnessPresetValue(id, key, value, applyBrightnessPresetsToAll)
        }
        onBrightnessPresetOrderChange={(keys) =>
          setBrightnessPresetOrder(id, keys, applyBrightnessPresetsToAll)
        }
        onIconChange={setSelectedIcon}
      />
    </>
  );
});

function getBrightnessPercent(entity: HassEntity): number {
  const brightnessPct = parseNumberish(entity.attributes?.brightness_pct);
  if (brightnessPct !== null) {
    return clampPercentage(brightnessPct);
  }

  const brightness = parseNumberish(entity.attributes?.brightness);
  if (brightness !== null) {
    // Home Assistant light brightness is 1..255. Only treat fractional values as 0..1 ratios.
    if (brightness >= 0 && brightness <= 1) {
      return clampPercentage(brightness * 100);
    }
    return clampPercentage((Math.max(0, Math.min(255, brightness)) / 255) * 100);
  }

  return entity.state === 'on' ? 100 : 0;
}

function parseNumberish(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
}

function clampPercentage(value: number, min = 0): number {
  return Math.max(min, Math.min(100, Math.round(value)));
}

function clampKelvin(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, roundKelvin(value)));
}

function getReportedColorTempKelvin(entity: HassEntity): number | null {
  const kelvin = parseNumberish(entity.attributes?.color_temp_kelvin);
  if (kelvin !== null) {
    return roundKelvin(kelvin);
  }

  const mired = parseNumberish(entity.attributes?.color_temp);
  if (mired !== null && mired > 0) {
    return roundKelvin(1000000 / mired);
  }

  return null;
}

function getReportedColorHex(entity: HassEntity): string | null {
  const rgbColor = entity.attributes?.rgb_color;
  if (
    Array.isArray(rgbColor) &&
    rgbColor.length >= 3 &&
    rgbColor.every((value) => typeof value === 'number' && Number.isFinite(value))
  ) {
    return rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]);
  }

  const hsColor = entity.attributes?.hs_color;
  if (
    Array.isArray(hsColor) &&
    hsColor.length >= 2 &&
    hsColor.every((value) => typeof value === 'number' && Number.isFinite(value))
  ) {
    return hsToHex(hsColor[0], hsColor[1]);
  }

  return null;
}

function hsToHex(hue: number, saturation: number): string {
  const normalizedHue = ((hue % 360) + 360) % 360;
  const normalizedSaturation = Math.max(0, Math.min(100, saturation)) / 100;
  const chroma = normalizedSaturation;
  const segment = normalizedHue / 60;
  const second = chroma * (1 - Math.abs((segment % 2) - 1));
  const match = 1 - chroma;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment >= 0 && segment < 1) {
    red = chroma;
    green = second;
  } else if (segment < 2) {
    red = second;
    green = chroma;
  } else if (segment < 3) {
    green = chroma;
    blue = second;
  } else if (segment < 4) {
    green = second;
    blue = chroma;
  } else if (segment < 5) {
    red = second;
    blue = chroma;
  } else {
    red = chroma;
    blue = second;
  }

  return rgbToHex((red + match) * 255, (green + match) * 255, (blue + match) * 255);
}

function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((value) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
}

function roundKelvin(value: number): number {
  return Math.round(value / 100) * 100;
}

function supportsColorTemperatureControl(entity?: HassEntity): boolean {
  if (!entity) {
    return true;
  }

  const colorModes = getSupportedColorModes(entity);
  return (
    colorModes.has('color_temp') ||
    typeof entity.attributes?.color_temp_kelvin === 'number' ||
    typeof entity.attributes?.color_temp === 'number'
  );
}

function supportsColorSelection(entity?: HassEntity): boolean {
  if (!entity) {
    return true;
  }

  const colorModes = getSupportedColorModes(entity);
  return ['hs', 'rgb', 'rgbw', 'rgbww', 'xy'].some((mode) => colorModes.has(mode));
}

function getSupportedColorModes(entity: HassEntity): Set<string> {
  const modes = entity.attributes?.supported_color_modes;
  if (Array.isArray(modes)) {
    return new Set(modes.filter((mode): mode is string => typeof mode === 'string'));
  }

  const colorMode = entity.attributes?.color_mode;
  if (typeof colorMode === 'string') {
    return new Set([colorMode]);
  }

  return new Set();
}

function getSupportedColorTemperatureRange(entity?: HassEntity): { min: number; max: number } {
  if (!entity) {
    return { min: 2700, max: 6500 };
  }

  const minKelvin = parseNumberish(entity.attributes?.min_color_temp_kelvin);
  const maxKelvin = parseNumberish(entity.attributes?.max_color_temp_kelvin);
  if (minKelvin !== null && maxKelvin !== null && minKelvin < maxKelvin) {
    const normalizedMin = Math.ceil(minKelvin / 100) * 100;
    const normalizedMax = Math.floor(maxKelvin / 100) * 100;
    return {
      min: normalizedMin < normalizedMax ? normalizedMin : roundKelvin(minKelvin),
      max: normalizedMin < normalizedMax ? normalizedMax : roundKelvin(maxKelvin),
    };
  }

  const minMired = parseNumberish(entity.attributes?.min_mireds);
  const maxMired = parseNumberish(entity.attributes?.max_mireds);
  if (minMired !== null && maxMired !== null && minMired > 0 && maxMired > 0) {
    const derivedMaxKelvin = Math.round(1000000 / minMired);
    const derivedMinKelvin = Math.round(1000000 / maxMired);
    if (derivedMinKelvin < derivedMaxKelvin) {
      const normalizedMin = Math.ceil(derivedMinKelvin / 100) * 100;
      const normalizedMax = Math.floor(derivedMaxKelvin / 100) * 100;
      return {
        min: normalizedMin < normalizedMax ? normalizedMin : roundKelvin(derivedMinKelvin),
        max: normalizedMin < normalizedMax ? normalizedMax : roundKelvin(derivedMaxKelvin),
      };
    }
  }

  return { min: 2700, max: 6500 };
}
