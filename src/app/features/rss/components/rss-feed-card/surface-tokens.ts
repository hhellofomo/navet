import { resolvePrimaryColorToken } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { PrimaryColor, ThemeType } from '@/app/hooks';

const RSS_ACCENT_COLORS = {
  orange: { strong: '#c2410c', base: '#f97316', soft: '#fed7aa' },
  blue: { strong: '#1d4ed8', base: '#3b82f6', soft: '#bfdbfe' },
  green: { strong: '#15803d', base: '#22c55e', soft: '#bbf7d0' },
  purple: { strong: '#7e22ce', base: '#a855f7', soft: '#e9d5ff' },
  pink: { strong: '#be185d', base: '#ec4899', soft: '#fbcfe8' },
  red: { strong: '#b91c1c', base: '#ef4444', soft: '#fecaca' },
  yellow: { strong: '#a16207', base: '#eab308', soft: '#fef08a' },
  teal: { strong: '#0f766e', base: '#14b8a6', soft: '#99f6e4' },
} as const;

export function getRSSFeedCardSurfaceTokens(theme: ThemeType, primaryColor: PrimaryColor) {
  const surface = getThemeSurfaceTokens(theme);
  const accentColor = RSS_ACCENT_COLORS[resolvePrimaryColorToken(primaryColor)];

  return {
    surface,
    accentColor,
    containerShadowClassName: theme === 'light' ? 'shadow-lg' : 'shadow-lg hover:shadow-xl',
    overlayClassName:
      theme === 'light'
        ? 'bg-white/60 backdrop-blur-sm'
        : theme === 'glass'
          ? 'bg-white/[0.03] backdrop-blur-sm'
          : 'bg-black/20 backdrop-blur-sm',
    textSecondaryClassName: theme === 'light' ? 'text-gray-500' : surface.textMuted,
    dividerClassName: theme === 'light' ? 'bg-gray-200' : 'bg-white/10',
    hoverClassName: theme === 'light' ? 'hover:bg-gray-100/80' : surface.hoverBg,
    dotClassName: theme === 'light' ? 'text-gray-300' : 'text-white/40',
    excerptClassName: theme === 'light' ? 'text-gray-500' : 'text-white/70',
    readMoreClassName: theme === 'light' ? 'text-gray-600' : 'text-white/80',
    iconWrapClassName: theme === 'light' ? '' : 'backdrop-blur-sm',
    iconBackgroundColor: theme === 'light' ? accentColor.soft : `${accentColor.base}33`,
    iconColor: theme === 'light' ? accentColor.base : '#ffffff',
    sourceColor: theme === 'light' ? accentColor.strong : accentColor.soft,
    thumbnailClassName:
      theme === 'light' ? 'bg-gray-100' : theme === 'glass' ? 'bg-white/8' : 'bg-white/10',
  };
}
