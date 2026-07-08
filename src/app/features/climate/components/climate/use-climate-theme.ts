import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks';

interface ClimateThemeColors {
  cardGradient: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  iconBg: string;
  iconColor: string;
  glowGradient: string;
  activeBtnBg: string;
  inactiveBtnBg: string;
}

export function useClimateTheme(theme: ThemeType): ClimateThemeColors {
  const surface = getThemeSurfaceTokens(theme);
  const cardGradient =
    theme === 'light'
      ? 'from-white to-purple-50/80'
      : theme === 'glass'
        ? 'from-white/16 via-purple-200/10 to-white/[0.03]'
        : 'from-purple-900/90 to-purple-950/95';
  const cardBorder = theme === 'light' ? 'border-gray-200/80' : theme === 'glass' ? surface.border : 'border-purple-700/30';
  const textPrimary = surface.textPrimary;
  const textSecondary = theme === 'light' ? 'text-gray-500' : surface.textSecondary;
  const iconBg = theme === 'light' ? 'bg-purple-100' : theme === 'glass' ? 'bg-purple-300/24 border border-purple-100/20' : 'bg-purple-500/24 border border-purple-300/18';
  const iconColor = theme === 'light' ? 'text-purple-700' : theme === 'glass' ? 'text-purple-100' : 'text-purple-300';
  const glowGradient = theme === 'light' ? 'from-purple-50/40' : theme === 'glass' ? 'from-white/10 via-purple-300/10' : 'from-purple-500/5';
  const activeBtnBg =
    theme === 'light' ? 'bg-purple-600 text-white' : theme === 'glass' ? 'bg-purple-400/85 text-white' : 'bg-purple-500 text-white';
  const inactiveBtnBg =
    theme === 'light'
      ? 'bg-gray-100 text-gray-600'
      : theme === 'glass'
        ? 'bg-white/8 text-white/80'
        : 'bg-white/5 text-gray-300';

  return {
    cardGradient,
    cardBorder,
    textPrimary,
    textSecondary,
    iconBg,
    iconColor,
    glowGradient,
    activeBtnBg,
    inactiveBtnBg,
  };
}
