import * as Slider from '@radix-ui/react-slider';
import { memo } from 'react';
import { useTheme } from '../../hooks';

interface ColorTemperature {
  value: number;
  color: string;
  label: string;
}

interface ColorTemperatureSectionProps {
  colorTemp: number;
  isOn: boolean;
  minTemp: number;
  maxTemp: number;
  tempOptions: ColorTemperature[];
  onTempChange: (temp: number) => void;
  onTempCommit?: (temp: number) => void;
}

export const ColorTemperatureSection = memo(function ColorTemperatureSection({
  colorTemp,
  isOn,
  minTemp,
  maxTemp,
  tempOptions,
  onTempChange,
  onTempCommit,
}: ColorTemperatureSectionProps) {
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
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-sm font-medium transition-colors duration-500 ${isOn ? 'text-gray-300' : 'text-gray-500'}`}
        >
          Color Temperature
        </span>
        <span
          className={`text-sm font-semibold transition-colors duration-500 ${isOn ? 'text-white' : 'text-gray-500'}`}
        >
          {roundToNearestHundred(colorTemp)}K
        </span>
      </div>

      {/* Temperature Slider */}
      <div className="mb-4">
        <Slider.Root
          value={[colorTemp]}
          onValueChange={(value) => onTempChange(value[0])}
          onValueCommit={(value) => onTempCommit?.(value[0])}
          min={minTemp}
          max={maxTemp}
          step={100}
          disabled={!isOn}
          className="relative flex items-center w-full h-5"
        >
          <Slider.Track
            className={`relative grow rounded-full h-2 transition-colors duration-500 ${
              isOn ? 'bg-gradient-to-r from-[#FFB366] via-[#FFF4E6] to-[#E6F2FF]' : 'bg-gray-700/20'
            }`}
          >
            <Slider.Range
              className="absolute rounded-full h-full"
              style={{ background: 'transparent' }}
            />
          </Slider.Track>
          <Slider.Thumb
            className={`block w-5 h-5 rounded-full shadow-lg focus:outline-none focus:ring-2 transition-all duration-500 border-2 ${
              isOn
                ? 'bg-white border-white cursor-pointer'
                : 'bg-gray-600 border-gray-600 focus:ring-gray-500/50 cursor-not-allowed'
            }`}
            style={isOn ? { boxShadow: `0 0 0 2px ${activeColor}` } : undefined}
          />
        </Slider.Root>
      </div>

      {/* Temperature Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tempOptions.map((temp) => (
          <button
            type="button"
            key={temp.value}
            onClick={() => {
              onTempChange(temp.value);
              onTempCommit?.(temp.value);
            }}
            disabled={!isOn}
            className={`h-10 rounded-full text-xs font-semibold transition-all duration-300 border-2 ${
              colorTemp === temp.value
                ? 'scale-105 shadow-lg text-white'
                : isOn
                  ? 'border-transparent hover:border-white/30'
                  : 'border-transparent cursor-not-allowed opacity-50'
            }`}
            style={{
              backgroundColor: isOn
                ? colorTemp === temp.value
                  ? activeColor
                  : temp.color
                : '#4a4a4a',
              borderColor: colorTemp === temp.value ? activeColor : undefined,
            }}
          >
            {temp.label}
          </button>
        ))}
      </div>
    </div>
  );
});

function roundToNearestHundred(value: number): number {
  return Math.round(value / 100) * 100;
}
