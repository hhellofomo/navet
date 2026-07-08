import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { CardActionRow } from '@/app/components/shared/card-action-row';
import { CardSettingsActionButton } from '@/app/components/shared/card-settings-action-button';
import { type CardSize, isExtraSmallCardSize } from '@/app/components/shared/card-size-selector';
import { BrightnessPresetsInline, BrightnessSlider } from '@/app/components/shared/device-editor';
import { useTheme } from '@/app/hooks';
import { CustomColorTrigger } from './custom-color-trigger';
import { LightCardHeader } from './light-card-header';
import type { HeaderIconButtonProps, LightBrightnessPreset } from './light-card-types';

interface LightCardSmallProps {
  name: string;
  room: string;
  size: CardSize;
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

export const LightCardSmall = memo(function LightCardSmall({
  name,
  size,
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
}: LightCardSmallProps) {
  const { theme } = useTheme();
  const isExtraSmall = isExtraSmallCardSize(size);
  const visiblePresetCount = showPresetOverflow ? (showSettingsButton ? 1 : 2) : undefined;

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
          <BrightnessSlider
            value={brightness}
            onChange={onBrightnessChange}
            onCommit={onBrightnessCommit}
            isOn={isOn}
            size="small"
            showLabel
          />
        )}

        {!isExtraSmall && (
          <CardActionRow
            theme={theme}
            size="small"
            leftContent={
              <>
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
                    maxVisible={visiblePresetCount}
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
