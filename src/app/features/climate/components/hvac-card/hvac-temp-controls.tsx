import { Minus, Plus } from 'lucide-react';
import { memo } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';

interface HVACTempControlsProps {
  targetTemp: number;
  onTempChange: (temp: number) => void;
  isOn: boolean;
  size?: CardSize;
}

export const HVACTempControls = memo(function HVACTempControls({
  targetTemp,
  onTempChange,
  isOn,
  size = 'medium',
}: HVACTempControlsProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const isCompact = size === 'extra-small' || size === 'small';
  const buttonSize = isCompact ? 'w-7 h-7' : size === 'medium' ? 'w-8 h-8' : 'w-12 h-12';
  const iconSize = isCompact ? 'w-3 h-3' : size === 'medium' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const hoverScale = isCompact ? 'hover:scale-105' : '';
  const btnBg =
    theme === 'light'
      ? 'bg-gray-900/10 hover:bg-gray-900/20'
      : `${surface.subtleBg} ${surface.hoverBg}`;
  const btnIcon = theme === 'light' ? 'text-gray-900' : 'text-white';

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTempChange(Math.max(16, targetTemp - 0.5));
        }}
        disabled={!isOn}
        className={`${buttonSize} rounded-full ${btnBg} ${hoverScale} transition-all flex items-center justify-center disabled:opacity-50`}
      >
        <Minus className={`${iconSize} ${btnIcon}`} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTempChange(Math.min(30, targetTemp + 0.5));
        }}
        disabled={!isOn}
        className={`${buttonSize} rounded-full ${btnBg} ${hoverScale} transition-all flex items-center justify-center disabled:opacity-50`}
      >
        <Plus className={`${iconSize} ${btnIcon}`} />
      </button>
    </>
  );
});
