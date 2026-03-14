import { Bell } from 'lucide-react';
import { useI18n } from '@/app/hooks';
import type { ThemeType } from '@/app/hooks/use-theme';
import { getNotificationSurfaceTokens } from './notification-surface-tokens';

interface NotificationEmptyStateProps {
  theme: ThemeType;
}

export function NotificationEmptyState({ theme }: NotificationEmptyStateProps) {
  const { t } = useI18n();
  const surface = getNotificationSurfaceTokens(theme);

  return (
    <div className="p-8 text-center">
      <div
        className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full ${surface.emptyStateIconBgClassName}`}
      >
        <Bell className={`h-8 w-8 ${surface.textMuted}`} />
      </div>
      <p className={`mb-1 text-sm font-medium ${surface.textPrimary}`}>
        {t('notifications.empty.title')}
      </p>
      <p className={`text-xs ${surface.textMuted}`}>{t('notifications.empty.description')}</p>
    </div>
  );
}
