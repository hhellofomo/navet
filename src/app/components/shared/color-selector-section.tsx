import { memo } from 'react';

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
  onCustomColorChange
}: ColorSelectorSectionProps) {
  return (
    <div>
      <span className={`text-sm font-medium mb-4 block transition-colors duration-500 ${isOn ? 'text-gray-300' : 'text-gray-500'}`}>
        Light Color
      </span>
      
      {/* Preset Colors + Custom Color Button */}
      <div className="grid grid-cols-6 gap-3">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            disabled={!isOn}
            className={`w-full aspect-square rounded-full transition-all duration-300 ${
              isOn ? 'hover:scale-110' : 'cursor-not-allowed opacity-50'
            } ${
              selectedColor === color ? 'ring-4 ring-white scale-110 shadow-lg' : ''
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
        
        {/* Custom Color Button with Rainbow Gradient */}
        <label
          className={`w-full aspect-square rounded-full bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 transition-all duration-300 flex items-center justify-center cursor-pointer relative overflow-hidden ${
            isOn ? 'hover:scale-110' : 'cursor-not-allowed opacity-50'
          }`}
          title="Custom color picker"
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
            <div className="w-3 h-3 rounded-full border-2 border-white" />
          </div>
        </label>
      </div>
    </div>
  );
});