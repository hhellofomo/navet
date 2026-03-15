import type { ThemeType } from '@/app/hooks/use-theme';

export interface CardShellSurfaceTokens {
  backdropClassName: string;
  sheenOverlayClassName: string | null;
}

export function getCardShellSurfaceTokens(theme: ThemeType): CardShellSurfaceTokens {
  if (theme === 'glass') {
    return {
      backdropClassName: 'backdrop-blur-xl',
      sheenOverlayClassName: 'absolute inset-0 bg-gradient-to-br from-white/5 to-transparent',
    };
  }

  return {
    backdropClassName: '',
    sheenOverlayClassName: null,
  };
}
