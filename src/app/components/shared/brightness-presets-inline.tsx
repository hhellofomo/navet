import * as Popover from '@radix-ui/react-popover';
import type { LucideIcon } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import { memo } from 'react';
import { useTheme } from '../../contexts/theme-context';

interface BrightnessPreset {
  icon: LucideIcon;
  brightness: number;
  key?: string;
  label: string;
}

interface BrightnessPresetsInlineProps {
  presets: BrightnessPreset[];
  currentBrightness: number;
  isOn: boolean;
  onBrightnessChange: (brightness: number) => void;
  size?: 'small' | 'medium' | 'large';
  maxVisible?: number;
  overflow?: 'hide' | 'menu';
}

export const BrightnessPresetsInline = memo(function BrightnessPresetsInline({
  presets,
  currentBrightness,
  isOn,
  onBrightnessChange,
  size = 'medium',
  maxVisible,
  overflow = 'hide',
}: BrightnessPresetsInlineProps) {
  const { theme, primaryColor } = useTheme();
  const buttonSize = size === 'small' ? 'w-7 h-7' : size === 'medium' ? 'w-8 h-8' : 'w-9 h-9';
  const iconSize = size === 'small' ? 'w-3 h-3' : size === 'medium' ? 'w-4 h-4' : 'w-4 h-4';
  const gap = size === 'large' ? 'gap-2' : 'gap-1.5';
  const visiblePresets = maxVisible ? presets.slice(0, maxVisible) : presets;
  const overflowPresets = maxVisible ? presets.slice(maxVisible) : [];
  const colorMap = {
    orange: '#f97316',
    blue: '#3b82f6',
    green: '#22c55e',
    purple: '#a855f7',
    pink: '#ec4899',
    red: '#ef4444',
    yellow: '#eab308',
    teal: '#14b8a6',
  } as const;
  const activeColor = colorMap[primaryColor];
  const selectedClasses =
    theme === 'light' ? 'text-white ring-2 scale-105' : 'text-white ring-2 scale-105';
  const unselectedClasses =
    theme === 'light'
      ? 'bg-gray-900/10 text-gray-900 hover:bg-gray-900/18'
      : 'bg-white/15 text-white hover:bg-white/25';
  const disabledSelectedClasses =
    theme === 'light'
      ? 'cursor-not-allowed text-white ring-2 scale-105 opacity-70'
      : 'cursor-not-allowed text-white ring-2 scale-105 opacity-70';
  const disabledUnselectedClasses =
    theme === 'light'
      ? 'cursor-not-allowed bg-gray-900/10 text-gray-500 opacity-50'
      : 'cursor-not-allowed opacity-50';

  return (
    <fieldset className={`flex items-center self-center ${gap}`} aria-label="Brightness presets">
      {visiblePresets.map((preset) => {
        const IconComponent = preset.icon;
        const isSelected = Math.abs(currentBrightness - preset.brightness) <= 2;

        return (
          <button
            type="button"
            key={preset.key ?? preset.brightness}
            disabled={!isOn}
            aria-label={`${preset.label} brightness ${preset.brightness} percent`}
            aria-pressed={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              onBrightnessChange(preset.brightness);
            }}
            style={
              isSelected
                ? {
                    backgroundColor: activeColor,
                    borderColor: `${activeColor}33`,
                    boxShadow: `0 0 0 2px ${theme === 'light' ? `${activeColor}33` : `${activeColor}55`}`,
                  }
                : undefined
            }
            className={`${buttonSize} rounded-full transition-all duration-300 flex items-center justify-center ${
              !isOn
                ? isSelected
                  ? disabledSelectedClasses
                  : disabledUnselectedClasses
                : isSelected
                  ? selectedClasses
                  : `${unselectedClasses} cursor-pointer hover:scale-105 active:scale-95`
            }`}
          >
            <IconComponent className={iconSize} aria-hidden="true" />
          </button>
        );
      })}
      {overflow === 'menu' && overflowPresets.length > 0 && (
        <BrightnessOverflowMenu
          presets={overflowPresets}
          currentBrightness={currentBrightness}
          isOn={isOn}
          onBrightnessChange={onBrightnessChange}
          buttonSize={buttonSize}
          iconSize={iconSize}
        />
      )}
    </fieldset>
  );
});

interface BrightnessOverflowMenuProps {
  presets: BrightnessPreset[];
  currentBrightness: number;
  isOn: boolean;
  onBrightnessChange: (brightness: number) => void;
  buttonSize: string;
  iconSize: string;
}

const BrightnessOverflowMenu = memo(function BrightnessOverflowMenu({
  presets,
  currentBrightness,
  isOn,
  onBrightnessChange,
  buttonSize,
  iconSize,
}: BrightnessOverflowMenuProps) {
  const { theme, primaryColor } = useTheme();
  const colorMap = {
    orange: '#f97316',
    blue: '#3b82f6',
    green: '#22c55e',
    purple: '#a855f7',
    pink: '#ec4899',
    red: '#ef4444',
    yellow: '#eab308',
    teal: '#14b8a6',
  } as const;
  const activeColor = colorMap[primaryColor];
  const triggerClasses =
    theme === 'light'
      ? 'bg-gray-900/10 text-gray-900 hover:bg-gray-900/18'
      : 'bg-white/15 text-white hover:bg-white/25';
  const disabledTriggerClasses =
    theme === 'light'
      ? 'opacity-50 cursor-not-allowed bg-gray-900/10 text-gray-500'
      : 'opacity-50 cursor-not-allowed bg-white/15 text-white';
  const selectedClasses =
    theme === 'light'
      ? 'bg-gray-900 text-white ring-2 ring-gray-900/15 scale-105'
      : 'bg-white text-gray-900 ring-2 ring-white/70 scale-105';
  const unselectedClasses =
    theme === 'light'
      ? 'bg-gray-900/10 text-gray-900 hover:bg-gray-900/18'
      : 'bg-white/15 text-white hover:bg-white/25';
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={!isOn}
          aria-label="More brightness presets"
          className={`${buttonSize} rounded-full transition-all duration-300 flex items-center justify-center ${
            !isOn
              ? disabledTriggerClasses
              : `cursor-pointer ${triggerClasses} hover:scale-105 active:scale-95`
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className={iconSize} aria-hidden="true" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          align="start"
          className="z-50 rounded-2xl border border-white/10 bg-[#1c1c1e]/95 p-3 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <fieldset className="flex items-center gap-2" aria-label="More brightness presets">
            {presets.map((preset) => {
              const IconComponent = preset.icon;
              const isSelected = Math.abs(currentBrightness - preset.brightness) <= 2;

              return (
                <button
                  type="button"
                  key={preset.key ?? preset.brightness}
                  aria-label={`${preset.label} brightness ${preset.brightness} percent`}
                  aria-pressed={isSelected}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBrightnessChange(preset.brightness);
                  }}
                  style={
                    isSelected
                      ? {
                          backgroundColor: activeColor,
                          borderColor: `${activeColor}33`,
                          boxShadow: `0 0 0 2px ${theme === 'light' ? `${activeColor}33` : `${activeColor}55`}`,
                        }
                      : undefined
                  }
                  className={`${buttonSize} rounded-full transition-all duration-300 flex items-center justify-center ${
                    isSelected ? selectedClasses : unselectedClasses
                  } cursor-pointer hover:scale-105 active:scale-95`}
                >
                  <IconComponent className={iconSize} aria-hidden="true" />
                </button>
              );
            })}
          </fieldset>
          <Popover.Arrow className="fill-[#1c1c1e]/95" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});
