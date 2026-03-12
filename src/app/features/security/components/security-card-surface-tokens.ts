import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';

export function getSecurityCardSurfaceTokens(theme: ThemeType) {
  const surface = getThemeSurfaceTokens(theme);

  return {
    surface,
    containerShadowClassName: surface.cardShadow,
    overlayClassName:
      theme === 'light' ? surface.lightOverlay : theme === 'glass' ? 'bg-white/[0.03]' : null,
    primaryTextClassName: surface.textPrimary,
    secondaryTextClassName: surface.textSecondary,
    subtleButtonClassName:
      theme === 'light'
        ? 'bg-gray-900/10 text-gray-900 hover:bg-gray-900/20'
        : `${surface.subtleBg} ${surface.hoverBg} text-white`,
    actionButtonClassName:
      theme === 'light'
        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        : theme === 'glass'
          ? 'bg-white/8 text-white hover:bg-white/12'
          : 'bg-white/5 text-white hover:bg-white/10',
    sliderTrackClassName:
      theme === 'light' ? 'bg-gray-200' : theme === 'glass' ? 'bg-white/12' : 'bg-white/10',
    dialogContentClassName:
      theme === 'glass'
        ? 'bg-white/10 border-white/18'
        : 'bg-gradient-to-br from-gray-900/95 to-gray-950/95 border-gray-700/50',
    dialogOptionClassName(themeSelected: boolean) {
      if (themeSelected) {
        return 'bg-indigo-500/20 border-indigo-500 shadow-lg shadow-indigo-500/20';
      }

      return theme === 'glass'
        ? 'bg-white/8 border-white/14 hover:bg-white/12 hover:border-white/22'
        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20';
    },
    dialogOptionIconWrapClassName(themeSelected: boolean) {
      if (themeSelected) {
        return 'bg-indigo-500/30';
      }

      return theme === 'glass' ? 'bg-white/12' : 'bg-white/10';
    },
    dialogOptionIconClassName(themeSelected: boolean) {
      return themeSelected ? 'text-indigo-400' : 'text-gray-300';
    },
    dialogOptionTextClassName(themeSelected: boolean) {
      return themeSelected ? 'text-white' : 'text-gray-300';
    },
    dialogCancelButtonClassName:
      theme === 'glass' ? 'bg-white/8 hover:bg-white/12' : 'bg-white/5 hover:bg-white/10',
  };
}
