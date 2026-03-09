import type { PrimaryColor, ThemeType } from '../hooks/use-theme';

export type ThemeOption = {
  value: ThemeType;
  label: string;
  description: string;
};

export type PrimaryColorOption = {
  value: PrimaryColor;
  label: string;
  color: string;
};

export const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'glass',
    label: 'Liquid Glass',
    description: 'Frosted translucent panels with luminous accents',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Subtle gradients with muted colors',
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Bright pastels with soft accents',
  },
  {
    value: 'contrast',
    label: 'High Contrast',
    description: 'Vibrant colors for better visibility',
  },
];

export const PRIMARY_COLOR_OPTIONS: PrimaryColorOption[] = [
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'green', label: 'Green', color: '#22c55e' },
  { value: 'purple', label: 'Purple', color: '#a855f7' },
  { value: 'pink', label: 'Pink', color: '#ec4899' },
  { value: 'red', label: 'Red', color: '#ef4444' },
  { value: 'yellow', label: 'Yellow', color: '#eab308' },
  { value: 'teal', label: 'Teal', color: '#14b8a6' },
];
