import { type PrimaryColor, useThemeStore } from '@/app/stores/theme-store';

type PresetPrimaryColor = Exclude<PrimaryColor, 'custom'>;

export const themeColorValues: Record<PresetPrimaryColor, string> = {
  orange: '#f97316',
  blue: '#3b82f6',
  green: '#22c55e',
  purple: '#a855f7',
  pink: '#ec4899',
  red: '#ef4444',
  yellow: '#eab308',
  teal: '#14b8a6',
};

const presetEntries = Object.entries(themeColorValues) as Array<[PresetPrimaryColor, string]>;

function normalizeHexColor(color: string | null | undefined): string | null {
  if (!color) {
    return null;
  }

  const trimmed = color.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;

  if (/^#[0-9a-fA-F]{6}$/.test(withHash)) {
    return withHash.toLowerCase();
  }

  if (/^#[0-9a-fA-F]{3}$/.test(withHash)) {
    const [, r, g, b] = withHash;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return null;
}

function hexToRgb(color: string) {
  return {
    r: Number.parseInt(color.slice(1, 3), 16),
    g: Number.parseInt(color.slice(3, 5), 16),
    b: Number.parseInt(color.slice(5, 7), 16),
  };
}

export function resolvePrimaryColorValue(color: PrimaryColor, customColor?: string | null): string {
  if (color !== 'custom') {
    return themeColorValues[color];
  }

  const resolvedCustomColor =
    normalizeHexColor(customColor) ??
    normalizeHexColor(useThemeStore.getState().customPrimaryColor) ??
    themeColorValues.orange;

  return resolvedCustomColor;
}

export function resolvePrimaryColorToken(
  color: PrimaryColor,
  customColor?: string | null
): PresetPrimaryColor {
  if (color !== 'custom') {
    return color;
  }

  const resolvedCustomColor =
    normalizeHexColor(customColor) ??
    normalizeHexColor(useThemeStore.getState().customPrimaryColor);

  if (!resolvedCustomColor) {
    return 'orange';
  }

  const target = hexToRgb(resolvedCustomColor);
  let bestMatch: PresetPrimaryColor = 'orange';
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const [preset, presetColor] of presetEntries) {
    const candidate = hexToRgb(presetColor);
    const distance =
      (candidate.r - target.r) ** 2 + (candidate.g - target.g) ** 2 + (candidate.b - target.b) ** 2;

    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = preset;
    }
  }

  return bestMatch;
}

export function getThemeColorValue(color: PrimaryColor): string {
  return resolvePrimaryColorValue(color);
}

export function sanitizeCustomPrimaryColor(color: string | null | undefined) {
  return normalizeHexColor(color);
}
