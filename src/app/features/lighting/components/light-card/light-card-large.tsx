import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { CardActionRow } from '@/app/components/shared/card-action-row';
import { CardSettingsActionButton } from '@/app/components/shared/card-settings-action-button';
import {
  BrightnessPresetsInline,
  BrightnessSlider,
  ColorPicker,
} from '@/app/components/shared/device-editor';
import { getCardStateSurfaceTokens } from '@/app/components/shared/theme/card-state-surface-tokens';
import { PRESET_COLORS } from '@/app/constants/light-constants';
import { useI18n, useTheme } from '@/app/hooks';
import { CustomColorTrigger } from './custom-color-trigger';
import { LightCardHeader } from './light-card-header';
import type { HeaderIconButtonProps, LightBrightnessPreset } from './light-card-types';

interface LightCardLargeProps {
  name: string;
  room: string;
  brightness: number;
  brightnessPresets: LightBrightnessPreset[];
  selectedColor: string | null;
  currentColor: string;
  isOn: boolean;
  IconComponent: LucideIcon;
  supportsColorControl: boolean;
  onBrightnessChange: (value: number) => void;
  onBrightnessCommit: (value: number) => void;
  onColorChange: (color: string) => void;
  iconButtonProps: HeaderIconButtonProps;
  settingsButtonProps: HeaderIconButtonProps;
  showSettingsButton: boolean;
}

export const LightCardLarge = memo(function LightCardLarge({
  name,
  brightness,
  brightnessPresets,
  selectedColor,
  currentColor,
  isOn,
  IconComponent,
  supportsColorControl,
  onBrightnessChange,
  onBrightnessCommit,
  onColorChange,
  iconButtonProps,
  settingsButtonProps,
  showSettingsButton,
}: Omit<LightCardLargeProps, 'room'>) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const stateSurface = getCardStateSurfaceTokens(theme, isOn);
  const secondaryTextColor = stateSurface.secondaryTextClassName;
  const textColor = stateSurface.primaryTextClassName;

  return (
    <>
      <LightCardHeader
        name={name}
        isOn={isOn}
        IconComponent={IconComponent}
        size="large"
        iconAriaLabel={iconButtonProps['aria-label']}
        onIconClick={iconButtonProps.onClick}
        onIconPointerDown={iconButtonProps.onPointerDown}
      />

      <div className="flex-1 flex flex-col justify-between">
        {/* Brightness section */}
        <div className="mb-2">
          <div className="flex items-baseline justify-between mb-2">
            <div className={`text-xs ${secondaryTextColor}`}>{t('lighting.brightness')}</div>
            <div className={`text-2xl font-bold ${textColor}`}>{brightness}%</div>
          </div>
          <BrightnessSlider
            value={brightness}
            onChange={onBrightnessChange}
            onCommit={onBrightnessCommit}
            isOn={isOn}
            showLabel={false}
            size="large"
          />
          <div className="mt-3">
            <BrightnessPresetsInline
              presets={brightnessPresets}
              currentBrightness={brightness}
              isOn={isOn}
              onBrightnessChange={onBrightnessCommit}
              size="large"
            />
          </div>
        </div>

        {supportsColorControl && (
          <div className="space-y-2">
            <div className={`text-xs ${secondaryTextColor}`}>{t('lighting.colors')}</div>
            <div className="flex items-center gap-2">
              <div className="flex gap-2 flex-1">
                <ColorPicker
                  colors={Array.from(PRESET_COLORS).slice(0, 4)}
                  selectedColor={selectedColor}
                  isOn={isOn}
                  onColorChange={onColorChange}
                  size="large"
                />
                <CustomColorTrigger
                  isOn={isOn}
                  currentColor={currentColor}
                  onColorChange={onColorChange}
                  size="large"
                />
              </div>
            </div>
          </div>
        )}

        {showSettingsButton && (
          <div className="mt-auto pt-4">
            <CardActionRow
              theme={theme}
              size="large"
              rightContent={
                <CardSettingsActionButton
                  {...settingsButtonProps}
                  theme={theme}
                  size="large"
                  tone={isOn ? 'default' : 'muted'}
                />
              }
            />
          </div>
        )}
      </div>
    </>
  );
});
