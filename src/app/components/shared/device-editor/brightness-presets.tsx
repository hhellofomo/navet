import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useI18n, useTheme } from '@/app/hooks';
import { getDeviceEditorSurfaceTokens } from './device-editor-surface-tokens';

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
  const { t } = useI18n();
  const activeColor = getThemeColorValue(primaryColor);
  const editorSurface = getDeviceEditorSurfaceTokens(isOn);

  return (
    <div>
      <span
        className={`mb-4 block text-sm font-medium transition-colors duration-500 ${editorSurface.sectionLabelClassName}`}
      >
        {t('lighting.brightnessPresets')}
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
                isOn ? 'hover:scale-110' : editorSurface.disabledCircleClassName
              } ${currentBrightness === preset.brightness ? 'scale-110 shadow-lg' : ''}`}
              style={{
                backgroundColor:
                  isOn && currentBrightness === preset.brightness
                    ? activeColor
                    : isOn
                      ? '#ffffff'
                      : editorSurface.disabledSurfaceColor,
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
                      : editorSurface.iconClassName
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
});
