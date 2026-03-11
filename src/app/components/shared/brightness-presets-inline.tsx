import * as Popover from '@radix-ui/react-popover';
import type { LucideIcon } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import { memo } from 'react';
import { useTheme } from '@/app/hooks';
import { getCardActionControlSizes } from './card-action-control-sizes';
import type { CardSize } from './card-size-selector';
import { getRoundControlStyles } from './theme/round-control-styles';

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
  size?: CardSize;
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
  const isCompact = size === 'extra-small' || size === 'small';
  const controlSizes = getCardActionControlSizes(
    isCompact ? 'small' : size === 'large' ? 'large' : 'medium'
  );
  const buttonSize = controlSizes.button;
  const iconSize = controlSizes.icon;
  const roundControl = getRoundControlStyles(theme);
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
  const neutralSelectedBg = theme === 'light' ? '#9ca3af' : 'rgba(255,255,255,0.22)';
  const neutralSelectedRing = theme === 'light' ? '#d1d5db' : 'rgba(255,255,255,0.16)';
  const selectedClasses = `${roundControl.selectedText} ring-2 scale-105`;
  const disabledSelectedClasses =
    theme === 'light'
      ? 'cursor-not-allowed text-white ring-2 scale-105 opacity-70'
      : 'cursor-not-allowed text-white ring-2 scale-105 opacity-70';
  const disabledUnselectedClasses = roundControl.disabledButton;

  return (
    <fieldset
      data-card-interactive
      className={`shrink-0 flex items-center self-center ${gap}`}
      aria-label="Brightness presets"
    >
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
                    backgroundColor:
                      isOn && theme === 'glass'
                        ? `${activeColor}26`
                        : isOn
                          ? activeColor
                          : neutralSelectedBg,
                    borderColor:
                      isOn && theme === 'glass'
                        ? 'rgba(255,255,255,0.16)'
                        : isOn
                          ? `${activeColor}33`
                          : 'transparent',
                    boxShadow: `0 0 0 2px ${
                      isOn
                        ? theme === 'glass'
                          ? 'rgba(255,255,255,0.10)'
                          : theme === 'light'
                            ? `${activeColor}33`
                            : `${activeColor}55`
                        : neutralSelectedRing
                    }`,
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
                  : `${roundControl.defaultButton} cursor-pointer hover:scale-105 active:scale-95`
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
  const roundControl = getRoundControlStyles(theme);
  const selectedClasses = `${roundControl.selectedText} ring-2 scale-105`;
  const unselectedClasses = roundControl.defaultButton;
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={!isOn}
          aria-label="More brightness presets"
          className={`${buttonSize} rounded-full transition-all duration-300 flex items-center justify-center ${
            !isOn
              ? roundControl.disabledButton
              : `cursor-pointer ${roundControl.defaultButton} hover:scale-105 active:scale-95`
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
                          backgroundColor: theme === 'glass' ? `${activeColor}26` : activeColor,
                          borderColor:
                            theme === 'glass' ? 'rgba(255,255,255,0.16)' : `${activeColor}33`,
                          boxShadow: `0 0 0 2px ${theme === 'glass' ? 'rgba(255,255,255,0.10)' : theme === 'light' ? `${activeColor}33` : `${activeColor}55`}`,
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
