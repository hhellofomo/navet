/**
 * Application Constants
 * Centralized configuration values
 */

export const APP_CONFIG = {
  DEFAULT_ROOM: 'Living Room',
  GRID: {
    COLS_MOBILE: 4,
    COLS_DESKTOP: 4,
    COLS_XL: 6,
    GAP: '0.75rem', // 3 in Tailwind
    GAP_MD: '1rem', // 4 in Tailwind
    ROW_HEIGHT: 170, // pixels
  },
  CARD_SIZES: {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
  } as const,
} as const;

export const THEME_COLORS = {
  BACKGROUND: '#0f0f0f',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#9ca3af',
} as const;
