import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import type { PrimaryColor, ThemeType } from '@/app/hooks/use-theme';

export function getBrightnessPresetAccentColor(primaryColor: PrimaryColor) {
  return getThemeColorValue(primaryColor);
}

export function getBrightnessPresetSelectedStyle(
  theme: ThemeType,
  activeColor: string,
  isOn: boolean
) {
  const neutralSelectedBg = theme === 'light' ? '#9ca3af' : 'rgba(255,255,255,0.22)';
  const neutralSelectedRing = theme === 'light' ? '#d1d5db' : 'rgba(255,255,255,0.16)';

  return {
    backgroundColor:
      isOn && theme === 'glass' ? `${activeColor}26` : isOn ? activeColor : neutralSelectedBg,
    borderColor:
      isOn && theme === 'glass'
        ? 'rgba(255,255,255,0.16)'
        : isOn
          ? `${activeColor}33`
          : 'transparent',
    boxShadow: `0 0 0 2px ${
      isOn
        ? theme === 'glass'
          ? 'rgba(255,255,255,0.10)'
          : theme === 'light'
            ? `${activeColor}33`
            : `${activeColor}55`
        : neutralSelectedRing
    }`,
  };
}
