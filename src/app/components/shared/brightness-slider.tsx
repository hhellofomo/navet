import * as Slider from '@radix-ui/react-slider';
import { memo } from 'react';
import { useTheme } from '../../hooks';
import type { CardSize } from './card-size-selector';

interface BrightnessSliderProps {
  value: number;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  disabled?: boolean;
  showLabel?: boolean;
  size?: CardSize;
  onClick?: (e: React.MouseEvent) => void;
}

export const BrightnessSlider = memo(function BrightnessSlider({
  value,
  onChange,
  onCommit,
  disabled = false,
  showLabel = true,
  size = 'medium',
  onClick,
}: BrightnessSliderProps) {
  const { theme, primaryColor } = useTheme();
  const isCompact = size === 'extra-small' || size === 'small';
  const heightClass = isCompact ? 'h-5' : 'h-6';
  const trackHeightClass = 'h-1';
  const thumbSizeClass = isCompact ? 'w-4 h-4' : 'w-5 h-5';
  const labelColor = theme === 'light' ? 'text-gray-500' : 'text-gray-300';
  const valueColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const trackBg = theme === 'light' ? 'bg-gray-200' : 'bg-white/10';
  const colorMap = {
    orange: { from: '#fb923c', to: '#f97316', ring: '#f97316' },
    blue: { from: '#60a5fa', to: '#3b82f6', ring: '#3b82f6' },
    green: { from: '#4ade80', to: '#22c55e', ring: '#22c55e' },
    purple: { from: '#c084fc', to: '#a855f7', ring: '#a855f7' },
    pink: { from: '#f472b6', to: '#ec4899', ring: '#ec4899' },
    red: { from: '#f87171', to: '#ef4444', ring: '#ef4444' },
    yellow: { from: '#facc15', to: '#eab308', ring: '#eab308' },
    teal: { from: '#2dd4bf', to: '#14b8a6', ring: '#14b8a6' },
  } as const;
  const activeColor = colorMap[primaryColor];

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
            className="absolute rounded-full h-full"
            style={{
              backgroundImage: `linear-gradient(to right, ${activeColor.from}, ${activeColor.to})`,
            }}
          />
        </Slider.Track>
        <Slider.Thumb
          className={`block ${thumbSizeClass} bg-white rounded-full shadow-lg focus:outline-none cursor-pointer touch-manipulation`}
          style={{ boxShadow: `0 0 0 2px ${activeColor.ring}` }}
        />
      </Slider.Root>
    </div>
  );
});
