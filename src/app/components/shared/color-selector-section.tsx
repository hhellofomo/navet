import { memo } from 'react';
import { useTheme } from '@/app/hooks';

interface ColorSelectorSectionProps {
  colors: string[];
  selectedColor: string | null;
  customColor: string;
  isOn: boolean;
  onColorChange: (color: string) => void;
  onCustomColorChange: (color: string) => void;
}

export const ColorSelectorSection = memo(function ColorSelectorSection({
  colors,
  selectedColor,
  customColor,
  isOn,
  onColorChange,
  onCustomColorChange,
}: ColorSelectorSectionProps) {
  const { primaryColor } = useTheme();
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
  return (
    <div>
      <span
        className={`text-sm font-medium mb-4 block transition-colors duration-500 ${isOn ? 'text-gray-300' : 'text-gray-500'}`}
      >
        Light Color
      </span>

      {/* Preset Colors + Custom Color Button */}
      <div className="grid grid-cols-6 gap-3">
        {colors.map((color) => (
          <button
            type="button"
            key={color}
            onClick={() => onColorChange(color)}
            disabled={!isOn}
            className={`w-full aspect-square rounded-full transition-all duration-300 ${
              isOn ? 'hover:scale-110' : 'cursor-not-allowed opacity-50'
            } ${selectedColor === color ? 'scale-110 shadow-lg' : ''}`}
            style={{
              backgroundColor: color,
              boxShadow: selectedColor === color ? `0 0 0 4px ${activeColor}` : undefined,
            }}
          />
        ))}

        {/* Custom Color Button */}
        <label
          className={`w-full aspect-square rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer relative overflow-hidden ${
            isOn ? 'hover:scale-110' : 'cursor-not-allowed opacity-50'
          }`}
          title="Custom color picker"
          style={{
            background: `linear-gradient(135deg, ${customColor} 0%, ${customColor}cc 45%, rgba(255, 255, 255, 0.9) 100%)`,
            boxShadow: selectedColor === customColor ? `0 0 0 4px ${activeColor}` : undefined,
          }}
        >
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              onCustomColorChange(e.target.value);
              onColorChange(e.target.value);
            }}
            disabled={!isOn}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
            <div
              className="w-3 h-3 rounded-full border border-white/80"
              style={{
                background: `linear-gradient(135deg, ${customColor} 0%, rgba(255, 255, 255, 0.9) 100%)`,
              }}
            />
          </div>
        </label>
      </div>
    </div>
  );
});
