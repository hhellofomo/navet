import { memo } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useTheme } from '../../contexts/theme-context';

interface BrightnessSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: (e: React.MouseEvent) => void;
}

export const BrightnessSlider = memo(function BrightnessSlider({ 
  value, 
  onChange, 
  disabled = false,
  showLabel = true,
  size = 'medium',
  onClick 
}: BrightnessSliderProps) {
  const { theme } = useTheme();
  const heightClass = size === 'small' ? 'h-4' : 'h-5';
  const trackHeightClass = size === 'small' ? 'h-1' : 'h-1';
  const thumbSizeClass = size === 'small' ? 'w-3 h-3' : 'w-4 h-4';
  const labelColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const valueColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const trackBg = theme === 'light' ? 'bg-gray-200' : 'bg-white/10';

  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs ${labelColor}`}>Brightness</span>
          <span className={`text-sm font-bold ${valueColor}`}>{value}%</span>
        </div>
      )}
      <Slider.Root
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        onClick={onClick}
        max={100}
        step={1}
        disabled={disabled}
        className={`relative flex items-center w-full ${heightClass}`}
      >
        <Slider.Track className={`relative grow rounded-full ${trackHeightClass} ${trackBg}`}>
          <Slider.Range className="absolute rounded-full h-full bg-gradient-to-r from-orange-400 to-orange-600" />
        </Slider.Track>
        <Slider.Thumb className={`block ${thumbSizeClass} bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer`} />
      </Slider.Root>
    </div>
  );
});