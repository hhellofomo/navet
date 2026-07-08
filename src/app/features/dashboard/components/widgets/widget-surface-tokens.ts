import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';

interface DashboardWidgetSurfaceTokens {
  panelClassName: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderClassName: string;
  dividerClassName: string;
  subtleFill: string;
}

export function getDashboardWidgetSurfaceTokens(theme: ThemeType): DashboardWidgetSurfaceTokens {
  const surface = getThemeSurfaceTokens(theme);

  return {
    panelClassName: `${theme === 'light' ? 'bg-white/70' : theme === 'contrast' ? 'bg-black/50' : surface.panel} backdrop-blur-xl rounded-2xl p-4 border ${theme === 'light' ? 'border-gray-200/50' : surface.border}`,
    textPrimary: surface.textPrimary,
    textSecondary: surface.textSecondary,
    textMuted: surface.textMuted,
    borderClassName: theme === 'light' ? 'border-gray-200/50' : surface.border,
    dividerClassName: theme === 'light' ? 'border-gray-200' : surface.border,
    subtleFill:
      theme === 'light'
        ? '#f3f4f6'
        : theme === 'contrast'
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(255,255,255,0.08)',
  };
}
