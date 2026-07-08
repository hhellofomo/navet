import type { CSSProperties } from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { PrimaryColor, ThemeType } from '@/app/hooks/use-theme';

export type InteractivePillIntent = 'navigation' | 'action';

export function getInteractivePillStyles({
  intent = 'navigation',
  isActive,
  primaryColor,
  theme,
}: {
  intent?: InteractivePillIntent;
  isActive: boolean;
  primaryColor: PrimaryColor;
  theme: ThemeType;
}): {
  className: string;
  style?: CSSProperties;
} {
  const surface = getThemeSurfaceTokens(theme);
  const accent = getThemeColorValue(primaryColor);

  if (!isActive) {
    if (intent === 'navigation') {
      const inactiveClass =
        theme === 'light'
          ? 'border border-transparent bg-transparent text-gray-600 hover:bg-gray-100'
          : theme === 'glass'
            ? 'border border-transparent bg-transparent text-white/72 hover:bg-white/8'
            : theme === 'contrast'
              ? 'border border-transparent bg-transparent text-gray-300 hover:bg-zinc-900'
              : 'border border-transparent bg-transparent text-gray-400 hover:bg-zinc-800';

      return { className: `${inactiveClass} transition-colors` };
    }

    const inactiveClass =
      theme === 'light'
        ? 'border border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
        : theme === 'glass'
          ? 'border border-white/12 bg-white/8 text-white/72 hover:bg-white/12'
          : theme === 'contrast'
            ? 'border border-zinc-700 bg-black text-gray-300 hover:bg-zinc-900'
            : `border ${surface.border} ${surface.subtleBg} ${surface.textSecondary} ${surface.hoverBg}`;

    return { className: `${inactiveClass} transition-colors` };
  }

  if (theme === 'light') {
    return {
      className: 'border border-transparent text-white shadow-sm transition-colors',
      style: {
        backgroundColor: accent,
      },
    };
  }

  if (theme === 'glass') {
    return {
      className: 'border text-white transition-colors',
      style: {
        backgroundColor: `${accent}14`,
        borderColor: 'rgba(255,255,255,0.16)',
        boxShadow:
          intent === 'navigation'
            ? `inset 0 1px 0 rgba(255,255,255,0.16), 0 10px 24px -18px ${accent}`
            : `inset 0 1px 0 rgba(255,255,255,0.16), 0 12px 28px -20px ${accent}`,
      },
    };
  }

  if (theme === 'contrast') {
    return {
      className: 'border text-white transition-colors',
      style: {
        backgroundColor: '#000000',
        borderColor: '#3f3f46',
      },
    };
  }

  return {
    className: 'border text-white transition-colors',
    style: {
      backgroundColor: '#18181b',
      borderColor: '#3f3f46',
      color: '#ffffff',
    },
  };
}
