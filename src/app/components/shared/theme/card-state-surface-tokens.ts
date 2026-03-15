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
      containerClassName: 'brightness-[0.98]',
      overlayClassName: null,
      primaryTextClassName: 'text-gray-700',
      secondaryTextClassName: 'text-gray-500',
      mutedTextClassName: 'text-gray-400',
      artworkClassName: 'brightness-[0.92] saturate-[0.78]',
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
      artworkClassName: 'brightness-[0.88] saturate-[0.72]',
    };
  }

  return {
    containerClassName: '',
    overlayClassName: null,
    primaryTextClassName: 'text-white/90',
    secondaryTextClassName: 'text-gray-300',
    mutedTextClassName: 'text-gray-400',
    artworkClassName: 'brightness-[0.88] saturate-[0.72]',
  };
}
