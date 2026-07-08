import { memo } from 'react';
import { getCardActionControlSizes } from '@/app/components/shared/card-action-control-sizes';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { useTheme } from '@/app/hooks';

interface CustomColorTriggerProps {
  isOn: boolean;
  currentColor: string;
  onColorChange: (color: string) => void;
  size: CardSize;
}

export const CustomColorTrigger = memo(function CustomColorTrigger({
  isOn,
  currentColor,
  onColorChange,
  size,
}: CustomColorTriggerProps) {
  const { theme } = useTheme();
  const controlSizes = getCardActionControlSizes(size === 'large' ? 'large' : 'small');
  const inputColor =
    typeof currentColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(currentColor)
      ? currentColor
      : '#ffa500';
  const triggerSize = controlSizes.button;
  const innerSize = controlSizes.inner;
  const dotSize = controlSizes.dot;
  const triggerBackground = isOn
    ? `linear-gradient(135deg, ${inputColor} 0%, ${inputColor}cc 45%, rgba(255, 255, 255, 0.9) 100%)`
    : theme === 'light'
      ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
      : 'linear-gradient(135deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.14) 100%)';
  const innerBackground = isOn
    ? 'rgba(255,255,255,0.2)'
    : theme === 'light'
      ? 'rgba(243,244,246,0.9)'
      : 'rgba(255,255,255,0.08)';
  const dotBackground = isOn
    ? `linear-gradient(135deg, ${inputColor} 0%, rgba(255, 255, 255, 0.9) 100%)`
    : theme === 'light'
      ? '#9ca3af'
      : 'rgba(255,255,255,0.45)';
  const dotBorder = isOn
    ? 'rgba(255,255,255,0.8)'
    : theme === 'light'
      ? '#9ca3af'
      : 'rgba(255,255,255,0.18)';

  return (
    <label
      data-card-interactive
      className={`${triggerSize} shrink-0 rounded-full hover:scale-105 transition-all flex items-center justify-center cursor-pointer relative overflow-hidden`}
      title="Custom color"
      aria-label="Choose custom color"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (e.currentTarget.querySelector('input[type="color"]') as HTMLInputElement)?.click();
        }
      }}
      tabIndex={isOn ? 0 : -1}
      style={{
        background: triggerBackground,
        opacity: isOn ? 1 : 0.5,
      }}
    >
      <input
        type="color"
        value={inputColor}
        aria-label="Choose custom color"
        onChange={(e) => {
          e.stopPropagation();
          onColorChange(e.target.value);
        }}
        disabled={!isOn}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <div
        className={`${innerSize} rounded-full backdrop-blur-sm flex items-center justify-center pointer-events-none`}
        style={{ backgroundColor: innerBackground }}
      >
        <div
          className={`${dotSize} rounded-full border`}
          style={{
            background: dotBackground,
            borderColor: dotBorder,
          }}
        />
      </div>
    </label>
  );
});
