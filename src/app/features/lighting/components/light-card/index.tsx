import { memo } from 'react';
import {
  type CardSize,
  CardSizeSelector,
  isCompactCardSize,
} from '@/app/components/shared/card-size-selector';
import { getCardStateSurfaceTokens } from '@/app/components/shared/theme/card-state-surface-tokens';
import { useTheme } from '@/app/hooks';
import { useSettingsStore } from '@/app/stores';
import { LightCardLarge } from './light-card-large';
import { LightCardMedium } from './light-card-medium';
import { LightCardSmall } from './light-card-small';
import { LightSettingsDialog } from './light-settings-dialog';
import { useLightCardController } from './use-light-card-controller';

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
  const { theme } = useTheme();
  const ambientLightBleed = useSettingsStore((state) => state.ambientLightBleed);
  const controller = useLightCardController({
    id,
    name,
    room,
    initialState,
    initialBrightness,
    initialTemp,
    size,
    isEditMode,
  });
  const stateSurface = getCardStateSurfaceTokens(theme, controller.isOn);

  const isSmall = isCompactCardSize(size);

  return (
    <>
      <div className="relative h-full w-full overflow-visible">
        {controller.isOn && ambientLightBleed && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -inset-[100%] z-0 blur-3xl transition-all duration-500 ${
              theme === 'light' ? 'opacity-40' : 'opacity-20'
            }`}
            style={{
              background: `radial-gradient(circle, ${controller.gradientColors.glow || 'transparent'} 0%, transparent 70%)`,
            }}
          />
        )}

        {isEditMode && (
          <CardSizeSelector
            currentSize={size}
            onSizeChange={(newSize) => onSizeChange(id, newSize)}
          />
        )}

        <div
          {...controller.cardInteraction.cardProps}
          className={`relative z-10 h-full w-full overflow-hidden rounded-3xl border backdrop-blur-xl ${controller.padding} transition-all duration-500 ${controller.gradientColors.border} ${stateSurface.containerClassName} ${!isEditMode ? 'cursor-pointer' : ''} ${
            controller.gradientColors.customGradient
              ? ''
              : `bg-gradient-to-br ${controller.gradientColors.from} ${controller.gradientColors.to}`
          } ${theme === 'light' && controller.isOn ? 'shadow-lg' : ''}`}
          style={
            controller.gradientColors.customGradient
              ? {
                  background: controller.gradientColors.customGradient,
                  borderColor: controller.selectedColor
                    ? `${controller.selectedColor}66`
                    : undefined,
                }
              : {}
          }
        >
          {theme === 'light' && (
            <div
              className="absolute inset-0"
              style={
                controller.isOn
                  ? {
                      background: controller.selectedColor
                        ? `linear-gradient(135deg, ${controller.selectedColor}2e 0%, rgba(255, 255, 255, 0.38) 100%)`
                        : 'rgba(255, 251, 235, 0.3)',
                    }
                  : { background: 'rgba(255, 255, 255, 0.6)' }
              }
            />
          )}

          {theme !== 'light' && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          )}

          {stateSurface.overlayClassName && (
            <div className={`absolute inset-0 ${stateSurface.overlayClassName}`} />
          )}

          <div className="relative h-full flex flex-col">
            {isSmall ? (
              <LightCardSmall
                name={name}
                room={room}
                size={size}
                brightness={controller.brightness}
                currentColor={controller.currentColor}
                brightnessPresets={controller.brightnessPresets}
                isOn={controller.isOn}
                IconComponent={controller.IconComponent}
                iconButtonProps={controller.iconButtonProps}
                settingsButtonProps={controller.settingsButtonProps}
                showSettingsButton={controller.showSettingsButton}
                showPresetOverflow={controller.showPresetOverflow}
                supportsColorControl={controller.supportsColorControl}
                onBrightnessChange={controller.onBrightnessChange}
                onBrightnessCommit={controller.onBrightnessCommit}
                onColorChange={controller.onColorChange}
              />
            ) : size === 'medium' ? (
              <LightCardMedium
                name={name}
                brightness={controller.brightness}
                currentColor={controller.currentColor}
                brightnessPresets={controller.brightnessPresets}
                isOn={controller.isOn}
                IconComponent={controller.IconComponent}
                iconButtonProps={controller.iconButtonProps}
                settingsButtonProps={controller.settingsButtonProps}
                showSettingsButton={controller.showSettingsButton}
                showPresetOverflow={controller.showPresetOverflow}
                supportsColorControl={controller.supportsColorControl}
                onBrightnessChange={controller.onBrightnessChange}
                onBrightnessCommit={controller.onBrightnessCommit}
                onColorChange={controller.onColorChange}
              />
            ) : (
              <LightCardLarge
                name={name}
                brightness={controller.brightness}
                brightnessPresets={controller.brightnessPresets}
                selectedColor={controller.selectedColor}
                currentColor={controller.currentColor}
                isOn={controller.isOn}
                IconComponent={controller.IconComponent}
                iconButtonProps={controller.iconButtonProps}
                settingsButtonProps={controller.settingsButtonProps}
                showSettingsButton={controller.showSettingsButton}
                supportsColorControl={controller.supportsColorControl}
                onBrightnessChange={controller.onBrightnessChange}
                onBrightnessCommit={controller.onBrightnessCommit}
                onColorChange={controller.onColorChange}
              />
            )}
          </div>
        </div>
      </div>

      <LightSettingsDialog
        entityId={id}
        isOpen={controller.isOpen}
        onOpenChange={controller.onOpenChange}
        name={name}
        room={room}
        isOn={controller.isOn}
        supportsColorTemperature={controller.supportsColorTemperature}
        supportsColorControl={controller.supportsColorControl}
        minColorTemp={controller.minColorTemp}
        maxColorTemp={controller.maxColorTemp}
        colorTemp={controller.colorTemp}
        brightnessPresets={controller.brightnessPresets}
        selectedColor={controller.selectedColor}
        customColor={controller.customColor}
        brightness={controller.brightness}
        selectedIcon={controller.selectedIcon}
        tempOptions={controller.tempOptions}
        onTempChange={controller.onTempChange}
        onTempCommit={controller.onTempCommit}
        onColorChange={controller.onColorChange}
        onCustomColorChange={controller.onCustomColorChange}
        onBrightnessChange={controller.onBrightnessCommit}
        applyBrightnessPresetsToAll={controller.applyBrightnessPresetsToAll}
        onApplyBrightnessPresetsToAllChange={controller.onApplyBrightnessPresetsToAllChange}
        onBrightnessPresetValueChange={controller.onBrightnessPresetValueChange}
        onBrightnessPresetOrderChange={controller.onBrightnessPresetOrderChange}
        onIconChange={controller.onIconChange}
      />
    </>
  );
});
