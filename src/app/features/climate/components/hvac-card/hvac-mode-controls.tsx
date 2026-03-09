import { Flame, Snowflake, Wind } from 'lucide-react';
import { memo } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import type { ThemeType } from '@/app/hooks/use-theme';
import { useTheme } from '@/app/hooks';
import { getHVACModeButtonColor } from '../../utils/hvac-styles';

interface HVACModeControlsProps {
  mode: string;
  isOn: boolean;
  onModeChange: (mode: string) => void;
  size?: CardSize;
}

export const HVACModeControls = memo(function HVACModeControls({
  mode,
  isOn,
  onModeChange,
  size = 'medium',
}: HVACModeControlsProps) {
  const { theme } = useTheme();
  const buttonSize = size === 'large' ? 'w-12 h-12' : 'w-8 h-8';
  const iconSize = size === 'large' ? 'w-5 h-5' : 'w-3.5 h-3.5';

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onModeChange('cool');
        }}
        disabled={!isOn}
        className={`${buttonSize} rounded-full transition-all flex items-center justify-center disabled:opacity-50 ${getHVACModeButtonColor('cool', mode, isOn, theme as ThemeType)}`}
      >
        <Snowflake className={iconSize} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onModeChange('heat');
        }}
        disabled={!isOn}
        className={`${buttonSize} rounded-full transition-all flex items-center justify-center disabled:opacity-50 ${getHVACModeButtonColor('heat', mode, isOn, theme as ThemeType)}`}
      >
        <Flame className={iconSize} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onModeChange('fan');
        }}
        disabled={!isOn}
        className={`${buttonSize} rounded-full transition-all flex items-center justify-center disabled:opacity-50 ${getHVACModeButtonColor('fan', mode, isOn, theme as ThemeType)}`}
      >
        <Wind className={iconSize} />
      </button>
    </>
  );
});
