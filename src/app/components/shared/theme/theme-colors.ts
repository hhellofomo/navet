import type { PrimaryColor } from '@/app/stores/theme-store';

export const themeColorValues: Record<PrimaryColor, string> = {
  orange: '#f97316',
  blue: '#3b82f6',
  green: '#22c55e',
  purple: '#a855f7',
  pink: '#ec4899',
  red: '#ef4444',
  yellow: '#eab308',
  teal: '#14b8a6',
};

export function getThemeColorValue(color: PrimaryColor): string {
  return themeColorValues[color];
}
