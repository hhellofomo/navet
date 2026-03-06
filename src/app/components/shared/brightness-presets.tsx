import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

interface BrightnessPreset {
  icon: LucideIcon;
  brightness: number;
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
  onBrightnessChange
}: BrightnessPresetsProps) {
  return (
    <div>
      <span className={`text-sm font-medium mb-4 block transition-colors duration-500 ${isOn ? 'text-gray-300' : 'text-gray-500'}`}>
        Brightness Presets
      </span>
      
      {/* Preset Brightness Levels */}
      <div className="grid grid-cols-6 gap-3 mb-4">
        {presets.map((preset) => {
          const IconComponent = preset.icon;
          return (
            <button
              key={preset.brightness}
              onClick={() => onBrightnessChange(preset.brightness)}
              disabled={!isOn}
              className={`w-full aspect-square rounded-full transition-all duration-300 flex items-center justify-center ${
                isOn ? 'hover:scale-110' : 'cursor-not-allowed opacity-50'
              } ${
                currentBrightness === preset.brightness ? 'ring-4 ring-white scale-110 shadow-lg' : ''
              }`}
              style={{ backgroundColor: isOn ? '#ffffff' : '#4a4a4a' }}
            >
              <IconComponent className={`w-5 h-5 ${isOn ? 'text-gray-900' : 'text-white'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
});