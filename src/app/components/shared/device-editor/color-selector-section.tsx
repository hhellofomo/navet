import { memo } from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useTheme } from '@/app/hooks';
import { getDeviceEditorSurfaceTokens } from './device-editor-surface-tokens';

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
  const activeColor = getThemeColorValue(primaryColor);
  const editorSurface = getDeviceEditorSurfaceTokens(isOn);
  return (
    <div>
      <span
        className={`mb-4 block text-sm font-medium transition-colors duration-500 ${editorSurface.sectionLabelClassName}`}
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
              isOn ? 'hover:scale-110' : editorSurface.disabledCircleClassName
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
            isOn ? 'hover:scale-110' : editorSurface.disabledCircleClassName
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
          <div className="pointer-events-none flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <div
              className="h-3 w-3 rounded-full border border-white/80"
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
