import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';

type AccentCardShell = {
  containerClassName: string;
  glowClassName: string;
  overlayClassName: string | null;
};

type AccentFamily = 'yellow' | 'green' | 'teal' | 'blue';

const ACCENT_CONFIG: Record<
  AccentFamily,
  {
    lightGradient: string;
    darkGradient: string;
    darkBorder: string;
    glassGradient: string;
    lightGlow: string;
    darkGlow: string;
    glassGlow: string;
  }
> = {
  yellow: {
    lightGradient: 'from-white to-yellow-50/80',
    darkGradient: 'from-yellow-900/90 to-yellow-950/95',
    darkBorder: 'border-yellow-700/30',
    glassGradient: 'from-white/16 via-yellow-200/10 to-white/[0.03]',
    lightGlow: 'from-yellow-50/40',
    darkGlow: 'from-blue-500/5',
    glassGlow: 'from-white/10 via-cyan-300/10',
  },
  green: {
    lightGradient: 'from-white to-green-50/80',
    darkGradient: 'from-green-900/90 to-green-950/95',
    darkBorder: 'border-green-700/30',
    glassGradient: 'from-white/16 via-green-200/10 to-white/[0.03]',
    lightGlow: 'from-green-50/40',
    darkGlow: 'from-green-500/5',
    glassGlow: 'from-white/10 via-green-300/10',
  },
  teal: {
    lightGradient: 'from-white to-teal-50/80',
    darkGradient: 'from-teal-900/90 to-teal-950/95',
    darkBorder: 'border-teal-700/30',
    glassGradient: 'from-white/16 via-teal-200/10 to-white/[0.03]',
    lightGlow: 'from-teal-50/40',
    darkGlow: 'from-teal-500/5',
    glassGlow: 'from-white/10 via-teal-300/10',
  },
  blue: {
    lightGradient: 'from-white to-slate-50/80',
    darkGradient: 'from-slate-900/95 to-slate-800/95',
    darkBorder: 'border-slate-700/30',
    glassGradient: 'from-white/14 via-blue-200/10 to-white/[0.03]',
    lightGlow: 'from-blue-50/30 via-transparent to-cyan-50/30',
    darkGlow: 'from-blue-500/5 via-transparent to-cyan-500/5',
    glassGlow: 'from-white/10 via-blue-300/10 to-cyan-200/08',
  },
};

export function getAccentCardShellTokens(theme: ThemeType, accent: AccentFamily): AccentCardShell {
  const surface = getThemeSurfaceTokens(theme);
  const config = ACCENT_CONFIG[accent];

  if (theme === 'light') {
    return {
      containerClassName: `bg-gradient-to-br ${config.lightGradient} border-gray-200/80 shadow-lg`,
      glowClassName: `bg-gradient-to-br ${config.lightGlow} to-transparent`,
      overlayClassName: 'bg-white/60',
    };
  }

  if (theme === 'glass') {
    return {
      containerClassName: `bg-gradient-to-br ${config.glassGradient} ${surface.border}`,
      glowClassName: `bg-gradient-to-br ${config.glassGlow} to-transparent`,
      overlayClassName: 'bg-white/[0.03]',
    };
  }

  return {
    containerClassName: `bg-gradient-to-br ${config.darkGradient} ${config.darkBorder}`,
    glowClassName: `bg-gradient-to-br ${config.darkGlow} to-transparent`,
    overlayClassName: null,
  };
}
