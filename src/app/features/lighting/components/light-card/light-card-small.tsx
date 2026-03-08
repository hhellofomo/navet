import type { LucideIcon } from 'lucide-react';
import { Settings2 } from 'lucide-react';
import { type ButtonHTMLAttributes, memo } from 'react';
import { BrightnessPresetsInline } from '@/app/components/shared/brightness-presets-inline';
import { BrightnessSlider } from '@/app/components/shared/brightness-slider';
import { useTheme } from '@/app/hooks';
import { CustomColorTrigger } from './custom-color-trigger';
import { LightCardHeader } from './light-card-header';

type HeaderIconButtonProps = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'onClick' | 'onPointerDown'
>;

interface LightCardSmallProps {
  name: string;
  room: string;
  brightness: number;
  currentColor: string;
  brightnessPresets: Array<{ brightness: number; icon: LucideIcon; key: string; label: string }>;
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
  const visiblePresetCount = showPresetOverflow ? (showSettingsButton ? 1 : 2) : undefined;
  const buttonBg =
    theme === 'light' ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20';
  const buttonText = theme === 'light' ? 'text-gray-900' : 'text-white';

  return (
    <>
      <LightCardHeader
        name={name}
        isOn={isOn}
        IconComponent={IconComponent}
        size="small"
        iconAriaLabel={iconButtonProps['aria-label']}
        onIconClick={iconButtonProps.onClick}
        onIconPointerDown={iconButtonProps.onPointerDown}
      />

      <div className="flex-1 flex flex-col justify-end gap-4">
        <BrightnessSlider
          value={brightness}
          onChange={onBrightnessChange}
          onCommit={onBrightnessCommit}
          size="small"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Color controls */}
        <div className="flex items-center gap-1.5">
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

          {supportsColorControl && (
            <CustomColorTrigger
              isOn={isOn}
              currentColor={currentColor}
              onColorChange={onColorChange}
              size="small"
            />
          )}

          {/* Settings button */}
          {showSettingsButton && (
            <button
              {...settingsButtonProps}
              className={`ml-auto w-7 h-7 shrink-0 rounded-full ${buttonBg} transition-all flex items-center justify-center cursor-pointer`}
            >
              <Settings2 className={`w-3 h-3 ${buttonText}`} />
            </button>
          )}
        </div>
      </div>
    </>
  );
});
