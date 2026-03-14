import { AlertTriangle, WifiOff } from 'lucide-react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n, useTheme } from '@/app/hooks';

interface NetworkStatusBannerProps {
  connected: boolean;
  connecting: boolean;
  isOnline: boolean;
}

export function NetworkStatusBanner({ connected, connecting, isOnline }: NetworkStatusBannerProps) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const surface = getThemeSurfaceTokens(theme);

  if (isOnline && (connected || connecting)) {
    return null;
  }

  const isOffline = !isOnline;
  const Icon = isOffline ? WifiOff : AlertTriangle;
  const title = isOffline ? t('network.offlineTitle') : t('network.disconnectedTitle');
  const description = isOffline
    ? t('network.offlineDescription')
    : t('network.disconnectedDescription');

  return (
    <div className="fixed inset-x-0 top-0 z-[70] px-3 pt-3 md:px-6">
      <div
        className={`mx-auto flex max-w-3xl items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl ${surface.panel} ${surface.borderStrong} ${
          theme === 'glass' ? 'backdrop-blur-2xl' : 'backdrop-blur-xl'
        }`}
      >
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/16 text-amber-300">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${surface.textPrimary}`}>{title}</p>
          <p className={`mt-1 text-xs leading-relaxed ${surface.textSecondary}`}>{description}</p>
        </div>
      </div>
    </div>
  );
}
