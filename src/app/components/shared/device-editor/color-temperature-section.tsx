import * as Slider from '@radix-ui/react-slider';
import { memo } from 'react';
import { ColorInputSwatch } from '@/app/components/shared/color-input-swatch';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useI18n, useTheme } from '@/app/hooks';
import { getDeviceEditorSurfaceTokens } from './device-editor-surface-tokens';

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
  const { t } = useI18n();
  const activeColor = getThemeColorValue(primaryColor);
  const editorSurface = getDeviceEditorSurfaceTokens(isOn);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-sm font-medium transition-colors duration-500 ${editorSurface.sectionLabelClassName}`}
        >
          {t('lighting.colorTemperature')}
        </span>
        <span
          className={`text-sm font-semibold transition-colors duration-500 ${editorSurface.sectionValueClassName}`}
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tempOptions.map((temp) => (
          <div key={temp.value} className="flex items-center gap-2 rounded-2xl px-2 py-2 text-left">
            <ColorInputSwatch
              mode="swatch"
              value={temp.color}
              ariaLabel={`${temp.label} (${temp.value}K)`}
              title={`${temp.label} (${temp.value}K)`}
              size="small"
              disabled={!isOn}
              selected={colorTemp === temp.value}
              ringColor={activeColor}
              className={`shrink-0 ${!isOn ? editorSurface.disabledCircleClassName : ''}`}
              onClick={() => {
                onTempChange(temp.value);
                onTempCommit?.(temp.value);
              }}
            />
            <div className="min-w-0">
              <div
                className={`text-xs font-semibold transition-colors duration-300 ${
                  colorTemp === temp.value
                    ? editorSurface.sectionValueClassName
                    : editorSurface.sectionLabelClassName
                }`}
              >
                {temp.label}
              </div>
              <div className={`text-[11px] ${editorSurface.sectionLabelClassName}`}>
                {temp.value}K
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

function roundToNearestHundred(value: number): number {
  return Math.round(value / 100) * 100;
}
