import * as Slider from '@radix-ui/react-slider';
import { memo } from 'react';
import { useTheme } from '@/app/hooks';
import type { CardSize } from './card-size-selector';

const BRIGHTNESS_ACCENT_COLORS = {
  orange: { from: '#fb923c', to: '#f97316', ring: '#f97316' },
  blue: { from: '#60a5fa', to: '#3b82f6', ring: '#3b82f6' },
  green: { from: '#4ade80', to: '#22c55e', ring: '#22c55e' },
  purple: { from: '#c084fc', to: '#a855f7', ring: '#a855f7' },
  pink: { from: '#f472b6', to: '#ec4899', ring: '#ec4899' },
  red: { from: '#f87171', to: '#ef4444', ring: '#ef4444' },
  yellow: { from: '#facc15', to: '#eab308', ring: '#eab308' },
  teal: { from: '#2dd4bf', to: '#14b8a6', ring: '#14b8a6' },
} as const;

interface BrightnessSliderProps {
  value: number;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  isOn?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
  size?: CardSize;
  onClick?: (e: React.MouseEvent) => void;
}

export const BrightnessSlider = memo(function BrightnessSlider({
  value,
  onChange,
  onCommit,
  isOn = true,
  disabled = false,
  showLabel = true,
  size = 'medium',
  onClick,
}: BrightnessSliderProps) {
  const { theme, primaryColor } = useTheme();
  const isExtraSmall = size === 'extra-small';
  const isCompact = isExtraSmall || size === 'small';
  const heightClass = isExtraSmall ? 'h-4' : isCompact ? 'h-5' : 'h-6';
  const trackHeightClass = isExtraSmall ? 'h-[3px]' : 'h-1';
  const thumbSizeClass = isExtraSmall ? 'w-3.5 h-3.5' : isCompact ? 'w-4 h-4' : 'w-5 h-5';
  const labelColor = theme === 'light' ? 'text-gray-500' : 'text-gray-300';
  const valueColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const trackBg = theme === 'light' ? 'bg-gray-200' : 'bg-white/10';
  const activeColor = BRIGHTNESS_ACCENT_COLORS[primaryColor];
  const rangeBg = isOn
    ? theme === 'glass'
      ? `linear-gradient(to right, rgba(255,255,255,0.52), ${activeColor.to}88)`
      : `linear-gradient(to right, ${activeColor.from}, ${activeColor.to})`
    : theme === 'light'
      ? 'linear-gradient(to right, #d1d5db, #9ca3af)'
      : 'linear-gradient(to right, rgba(255,255,255,0.24), rgba(255,255,255,0.14))';
  const thumbBg = isOn
    ? theme === 'glass'
      ? 'rgba(255,255,255,0.92)'
      : '#ffffff'
    : theme === 'light'
      ? '#f3f4f6'
      : '#d1d5db';
  const thumbRing = isOn
    ? theme === 'glass'
      ? 'rgba(255,255,255,0.34)'
      : activeColor.ring
    : theme === 'light'
      ? '#9ca3af'
      : 'rgba(255,255,255,0.24)';

  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs ${labelColor}`}>Brightness</span>
          <span className={`text-sm font-bold ${valueColor}`}>{value}%</span>
        </div>
      )}
      <Slider.Root
        data-card-interactive
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        onValueCommit={(val) => onCommit?.(val[0])}
        onClick={onClick}
        min={1}
        max={100}
        step={1}
        disabled={disabled}
        className={`relative flex items-center w-full ${heightClass}`}
      >
        <Slider.Track className={`relative grow rounded-full ${trackHeightClass} ${trackBg}`}>
          <Slider.Range
            className="absolute h-full rounded-full"
            style={{
              backgroundImage: rangeBg,
            }}
          />
        </Slider.Track>
        <Slider.Thumb
          className={`block ${thumbSizeClass} rounded-full shadow-lg focus:outline-none cursor-pointer touch-manipulation`}
          style={{ backgroundColor: thumbBg, boxShadow: `0 0 0 2px ${thumbRing}` }}
        />
      </Slider.Root>
    </div>
  );
});
