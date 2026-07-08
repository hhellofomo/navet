import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { CardActionRow } from '@/app/components/shared/card-action-row';
import { CardSettingsActionButton } from '@/app/components/shared/card-settings-action-button';
import { BrightnessPresetsInline, BrightnessSlider } from '@/app/components/shared/device-editor';
import { useTheme } from '@/app/hooks';
import { CustomColorTrigger } from './custom-color-trigger';
import { LightCardHeader } from './light-card-header';
import type { HeaderIconButtonProps, LightBrightnessPreset } from './light-card-types';

interface LightCardMediumProps {
  name: string;
  room: string;
  brightness: number;
  currentColor: string;
  brightnessPresets: LightBrightnessPreset[];
  isOn: boolean;
  IconComponent: LucideIcon;
  supportsColorControl: boolean;
  onBrightnessChange: (value: number) => void;
  onBrightnessCommit: (value: number) => void;
  onColorChange: (color: string) => void;
  iconButtonProps: HeaderIconButtonProps;
  settingsButtonProps: HeaderIconButtonProps;
  showSettingsButton: boolean;
  showPresetOverflow: boolean;
}

export const LightCardMedium = memo(function LightCardMedium({
  name,
  brightness,
  currentColor,
  brightnessPresets,
  isOn,
  IconComponent,
  supportsColorControl,
  onBrightnessChange,
  onBrightnessCommit,
  onColorChange,
  iconButtonProps,
  settingsButtonProps,
  showSettingsButton,
  showPresetOverflow,
}: Omit<LightCardMediumProps, 'room'>) {
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
        {/* Brightness slider */}
        <BrightnessSlider
          value={brightness}
          onChange={onBrightnessChange}
          onCommit={onBrightnessCommit}
          isOn={isOn}
          size="medium"
        />

        {/* Color controls */}
        <CardActionRow
          theme={theme}
          size="medium"
          leftContent={
            <>
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
