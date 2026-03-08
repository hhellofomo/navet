import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { useTheme } from '../../hooks';

interface BrightnessPreset {
  icon: LucideIcon;
  brightness: number;
  key?: string;
  label: string;
}

interface BrightnessPresetsProps {
  presets: BrightnessPreset[];
  currentBrightness: number;
  isOn: boolean;
  onBrightnessChange: (brightness: number) => void;
}

export const BrightnessPresets = memo(function BrightnessPresets({
  presets,
  currentBrightness,
  isOn,
  onBrightnessChange,
}: BrightnessPresetsProps) {
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
        Brightness Presets
      </span>

      {/* Preset Brightness Levels */}
      <div className="grid grid-cols-6 gap-3 mb-4">
        {presets.map((preset) => {
          const IconComponent = preset.icon;
          return (
            <button
              type="button"
              key={preset.brightness}
              onClick={() => onBrightnessChange(preset.brightness)}
              disabled={!isOn}
              className={`w-full aspect-square rounded-full transition-all duration-300 flex items-center justify-center ${
                isOn ? 'hover:scale-110' : 'cursor-not-allowed opacity-50'
              } ${currentBrightness === preset.brightness ? 'scale-110 shadow-lg' : ''}`}
              style={{
                backgroundColor:
                  isOn && currentBrightness === preset.brightness
                    ? activeColor
                    : isOn
                      ? '#ffffff'
                      : '#4a4a4a',
                boxShadow:
                  currentBrightness === preset.brightness ? `0 0 0 4px ${activeColor}` : undefined,
              }}
            >
              <IconComponent
                className={`w-5 h-5 ${
                  isOn && currentBrightness === preset.brightness
                    ? 'text-white'
                    : isOn
                      ? 'text-gray-900'
                      : 'text-white'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
});
