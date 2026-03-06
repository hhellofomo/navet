import { memo } from 'react';
import { useTheme } from '../../contexts/theme-context';

interface ColorPickerProps {
  colors: string[];
  selectedColor: string | null;
  isOn: boolean;
  onColorChange: (color: string) => void;
  size?: 'small' | 'medium' | 'large';
}

export const ColorPicker = memo(function ColorPicker({
  colors,
  selectedColor,
  isOn,
  onColorChange,
  size = 'medium',
}: ColorPickerProps) {
  const { theme } = useTheme();
  const buttonSize = size === 'small' ? 'w-8 h-8' : size === 'medium' ? 'w-10 h-10' : 'w-12 h-12';
  const ringOffset = theme === 'light' ? 'ring-offset-white' : 'ring-offset-gray-900';

  return (
    <>
      {colors.map((color) => (
        <button
          type="button"
          key={color}
          aria-label={`Select color ${color}`}
          aria-pressed={selectedColor === color}
          onClick={(e) => {
            e.stopPropagation();
            onColorChange(color);
          }}
          disabled={!isOn}
          className={`${buttonSize} rounded-full transition-all duration-500 ${
            selectedColor === color
              ? `ring-2 ring-white ring-offset-2 ${ringOffset} scale-110`
              : 'hover:scale-105'
          } ${!isOn ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </>
  );
});
