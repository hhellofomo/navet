import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { CardActionRow } from '@/app/components/shared/card-action-row';
import { CardSettingsActionButton } from '@/app/components/shared/card-settings-action-button';
import {
  BrightnessPresetsInline,
  BrightnessSlider,
  KelvinSlider,
} from '@/app/components/shared/device-editor';
import { useTheme } from '@/app/hooks';
import { CustomColorTrigger } from './custom-color-trigger';
import { KelvinColorTrigger } from './kelvin-color-trigger';
import { LightCardHeader } from './light-card-header';
import type { HeaderIconButtonProps, LightBrightnessPreset } from './light-card-types';

interface LightCardMediumProps {
  name: string;
  brightness: number;
  currentColor: string;
  colorTemp: number;
  currentTempColor: string;
  minColorTemp: number;
  maxColorTemp: number;
  brightnessPresets: LightBrightnessPreset[];
  isOn: boolean;
  isKelvinMode: boolean;
  IconComponent: LucideIcon;
  supportsColorControl: boolean;
  supportsColorTemperature: boolean;
  onKelvinToggle: () => void;
  onBrightnessChange: (value: number) => void;
  onBrightnessCommit: (value: number) => void;
  onColorChange: (color: string) => void;
  onTempChange: (temp: number) => void;
  onTempCommit: (temp: number) => void;
  iconButtonProps: HeaderIconButtonProps;
  settingsButtonProps: HeaderIconButtonProps;
  showSettingsButton: boolean;
  showPresetOverflow: boolean;
}

export const LightCardMedium = memo(function LightCardMedium({
  name,
  brightness,
  currentColor,
  colorTemp,
  currentTempColor,
  minColorTemp,
  maxColorTemp,
  brightnessPresets,
  isOn,
  isKelvinMode,
  IconComponent,
  supportsColorControl,
  supportsColorTemperature,
  onKelvinToggle,
  onBrightnessChange,
  onBrightnessCommit,
  onColorChange,
  onTempChange,
  onTempCommit,
  iconButtonProps,
  settingsButtonProps,
  showSettingsButton,
  showPresetOverflow,
}: LightCardMediumProps) {
  const { theme } = useTheme();

  return (
    <>
      <LightCardHeader
        name={name}
        isOn={isOn}
        IconComponent={IconComponent}
        size="medium"
        iconAriaLabel={iconButtonProps['aria-label']}
        onIconClick={iconButtonProps.onClick}
        onIconPointerDown={iconButtonProps.onPointerDown}
      />

      <div className="flex-1 flex flex-col justify-end gap-4">
        {isKelvinMode && supportsColorTemperature ? (
          <KelvinSlider
            value={colorTemp}
            currentTempColor={currentTempColor}
            onChange={onTempChange}
            onCommit={onTempCommit}
            isOn={isOn}
            min={minColorTemp}
            max={maxColorTemp}
            size="medium"
          />
        ) : (
          <BrightnessSlider
            value={brightness}
            onChange={onBrightnessChange}
            onCommit={onBrightnessCommit}
            isOn={isOn}
            size="medium"
          />
        )}

        <CardActionRow
          theme={theme}
          size="medium"
          leftContent={
            <>
              {supportsColorTemperature && (
                <KelvinColorTrigger
                  isOn={isOn}
                  currentTempColor={currentTempColor}
                  isActive={isKelvinMode}
                  size="medium"
                  onClick={onKelvinToggle}
                />
              )}

              {supportsColorControl && (
                <CustomColorTrigger
                  isOn={isOn}
                  currentColor={currentColor}
                  onColorChange={onColorChange}
                  size="medium"
                />
              )}

              <div className="flex min-w-0 items-center gap-2">
                <BrightnessPresetsInline
                  presets={brightnessPresets}
                  currentBrightness={brightness}
                  isOn={isOn}
                  onBrightnessChange={onBrightnessCommit}
                  size="medium"
                  maxVisible={showPresetOverflow ? 3 : undefined}
                  overflow={showPresetOverflow ? 'menu' : 'hide'}
                />
              </div>
            </>
          }
          rightContent={
            showSettingsButton ? (
              <CardSettingsActionButton
                {...settingsButtonProps}
                theme={theme}
                size="medium"
                tone={isOn ? 'default' : 'muted'}
              />
            ) : undefined
          }
        />
      </div>
    </>
  );
});
