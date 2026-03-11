import type { ThemeType } from '@/app/hooks/use-theme';
import { getThemeSurfaceTokens } from './theme-surface-tokens';

export interface CardStateSurfaceTokens {
  containerClassName: string;
  overlayClassName: string | null;
  primaryTextClassName: string;
  secondaryTextClassName: string;
  mutedTextClassName: string;
  artworkClassName: string;
}

export function getCardStateSurfaceTokens(
  theme: ThemeType,
  isActive: boolean
): CardStateSurfaceTokens {
  const surface = getThemeSurfaceTokens(theme);

  if (isActive) {
    return {
      containerClassName: '',
      overlayClassName: null,
      primaryTextClassName: surface.textPrimary,
      secondaryTextClassName: surface.textSecondary,
      mutedTextClassName: surface.textMuted,
      artworkClassName: '',
    };
  }

  if (theme === 'light') {
    return {
      containerClassName: 'saturate-[0.86]',
      overlayClassName: 'bg-white/18',
      primaryTextClassName: 'text-gray-700',
      secondaryTextClassName: 'text-gray-500',
      mutedTextClassName: 'text-gray-400',
      artworkClassName: 'opacity-70 saturate-[0.72]',
    };
  }

  if (theme === 'glass') {
    return {
      containerClassName: 'saturate-[0.82]',
      overlayClassName: 'bg-slate-950/14',
      primaryTextClassName: 'text-white/88',
      secondaryTextClassName: 'text-white/66',
      mutedTextClassName: 'text-white/52',
      artworkClassName: 'opacity-68 saturate-[0.74]',
    };
  }

  if (theme === 'contrast') {
    return {
      containerClassName: '',
      overlayClassName: null,
      primaryTextClassName: 'text-white',
      secondaryTextClassName: 'text-gray-300',
      mutedTextClassName: 'text-gray-400',
      artworkClassName: 'opacity-62 saturate-[0.68]',
    };
  }

  return {
    containerClassName: 'saturate-[0.84]',
    overlayClassName: 'bg-black/10',
    primaryTextClassName: 'text-white/90',
    secondaryTextClassName: 'text-gray-300',
    mutedTextClassName: 'text-gray-400',
    artworkClassName: 'opacity-66 saturate-[0.72]',
  };
}
