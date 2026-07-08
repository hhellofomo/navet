import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';

type PersonState = 'home' | 'away';

interface PersonCardSurfaceTokens {
  titleClassName: string;
  locationClassName: string;
  typeLabelClassName: string;
  avatarAwayBgClassName: string;
  avatarIconClassName: string;
  statusPillClassName: string;
  statusLabelClassName: string;
  homeIconClassName: string;
  awayIconClassName: string;
  containerShadowClassName: string;
  overlayClassName: string | null;
}

export function getPersonCardSurfaceTokens(
  theme: ThemeType,
  state: PersonState
): PersonCardSurfaceTokens {
  const surface = getThemeSurfaceTokens(theme);
  const isHome = state === 'home';

  return {
    titleClassName: isHome ? surface.textPrimary : surface.textSubtle,
    locationClassName: isHome ? surface.textSecondary : surface.textMuted,
    typeLabelClassName: surface.textMuted,
    avatarAwayBgClassName: theme === 'light' ? 'bg-gray-200' : 'bg-gray-700/30',
    avatarIconClassName: isHome
      ? 'text-white'
      : theme === 'light'
        ? 'text-gray-600'
        : 'text-gray-300',
    statusPillClassName: theme === 'light' ? 'bg-gray-100' : 'bg-white/5',
    statusLabelClassName:
      theme === 'light' ? (isHome ? 'text-gray-700' : 'text-gray-500') : 'text-gray-300',
    homeIconClassName: theme === 'light' ? 'text-emerald-600' : 'text-emerald-400',
    awayIconClassName: theme === 'light' ? 'text-gray-500' : 'text-gray-300',
    containerShadowClassName: surface.cardShadow,
    overlayClassName: theme === 'light' ? surface.lightOverlay : null,
  };
}
