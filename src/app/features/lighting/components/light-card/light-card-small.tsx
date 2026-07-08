import type { LucideIcon } from 'lucide-react';
import { memo, useState } from 'react';
import { CardActionRow } from '@/app/components/shared/card-action-row';
import { CardSettingsActionButton } from '@/app/components/shared/card-settings-action-button';
import { type CardSize, isExtraSmallCardSize } from '@/app/components/shared/card-size-selector';
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

interface LightCardSmallProps {
  name: string;
  room: string;
  size: CardSize;
  brightness: number;
  currentColor: string;
  colorTemp: number;
  currentTempColor: string;
  minColorTemp: number;
  maxColorTemp: number;
  brightnessPresets: LightBrightnessPreset[];
  isOn: boolean;
  IconComponent: LucideIcon;
  supportsColorControl: boolean;
  supportsColorTemperature: boolean;
  onBrightnessChange: (value: number) => void;
  onBrightnessCommit: (value: number) => void;
  onColorChange: (color: string) => void;
  onTempChange: (temp: number) => void;
  onTempCommit: (temp: number) => void;
  iconButtonProps: HeaderIconButtonProps;
  settingsButtonProps: HeaderIconButtonProps;
  showSettingsButton: boolean;
}

export const LightCardSmall = memo(function LightCardSmall({
  name,
  size,
  brightness,
  currentColor,
  colorTemp,
  currentTempColor,
  minColorTemp,
  maxColorTemp,
  brightnessPresets,
  isOn,
  IconComponent,
  supportsColorControl,
  supportsColorTemperature,
  onBrightnessChange,
  onBrightnessCommit,
  onColorChange,
  onTempChange,
  onTempCommit,
  iconButtonProps,
  settingsButtonProps,
  showSettingsButton,
}: LightCardSmallProps) {
  const { theme } = useTheme();
  const isExtraSmall = isExtraSmallCardSize(size);
  const hasColorFeatures = supportsColorTemperature || supportsColorControl;
  const colorButtonCount = (supportsColorTemperature ? 1 : 0) + (supportsColorControl ? 1 : 0);
  // If color features exist: cap visible presets so total left buttons ≤ 2, rest in overflow menu.
  // If no color features: show all presets inline.
  const presetMaxVisible = hasColorFeatures ? Math.max(0, 2 - colorButtonCount) : undefined;
  const presetOverflow: 'menu' | 'hide' = hasColorFeatures ? 'menu' : 'hide';
  const [isKelvinMode, setIsKelvinMode] = useState(false);

  const handleKelvinToggle = () => {
    if (isOn) setIsKelvinMode((prev) => !prev);
  };

  return (
    <>
      <LightCardHeader
        name={name}
        isOn={isOn}
        IconComponent={IconComponent}
        size={size}
        iconAriaLabel={iconButtonProps['aria-label']}
        onIconClick={iconButtonProps.onClick}
        onIconPointerDown={iconButtonProps.onPointerDown}
      />

      <div
        className={`flex-1 flex flex-col ${isExtraSmall ? 'justify-start gap-0.5 -mt-0.5' : 'justify-end gap-4'}`}
      >
        {isExtraSmall ? (
          <div className="flex min-h-6 items-center gap-1.5">
            <div className="min-w-0 flex-1">
              <BrightnessSlider
                value={brightness}
                onChange={onBrightnessChange}
                onCommit={onBrightnessCommit}
                isOn={isOn}
                size="extra-small"
                showLabel={false}
              />
            </div>

            {showSettingsButton && (
              <CardSettingsActionButton
                {...settingsButtonProps}
                theme={theme}
                size="extra-small"
                tone={isOn ? 'default' : 'muted'}
              />
            )}
          </div>
        ) : (
          <>
            {isKelvinMode && supportsColorTemperature ? (
              <KelvinSlider
                value={colorTemp}
                currentTempColor={currentTempColor}
                onChange={onTempChange}
                onCommit={onTempCommit}
                isOn={isOn}
                min={minColorTemp}
                max={maxColorTemp}
                size="small"
                showLabel
              />
            ) : (
              <BrightnessSlider
                value={brightness}
                onChange={onBrightnessChange}
                onCommit={onBrightnessCommit}
                isOn={isOn}
                size="small"
                showLabel
              />
            )}
          </>
        )}

        {!isExtraSmall && (
          <CardActionRow
            theme={theme}
            size="small"
            leftContent={
              <>
                {supportsColorTemperature && (
                  <KelvinColorTrigger
                    isOn={isOn}
                    currentTempColor={currentTempColor}
                    isActive={isKelvinMode}
                    size="small"
                    onClick={handleKelvinToggle}
                  />
                )}

                {supportsColorControl && (
                  <CustomColorTrigger
                    isOn={isOn}
                    currentColor={currentColor}
                    onColorChange={onColorChange}
                    size="small"
                  />
                )}

                <div className="flex min-w-0 items-center gap-1.5">
                  <BrightnessPresetsInline
                    presets={brightnessPresets}
                    currentBrightness={brightness}
                    isOn={isOn}
                    onBrightnessChange={onBrightnessCommit}
                    size="small"
                    maxVisible={presetMaxVisible}
                    overflow={presetOverflow}
                  />
                </div>
              </>
            }
            rightContent={
              showSettingsButton ? (
                <CardSettingsActionButton
                  {...settingsButtonProps}
                  theme={theme}
                  size="small"
                  tone={isOn ? 'default' : 'muted'}
                />
              ) : undefined
            }
          />
        )}
      </div>
    </>
  );
});
