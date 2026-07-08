import { Bell } from 'lucide-react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { DashboardEmptyState } from '@/app/features/dashboard/components/dashboard-empty-state';
import { useI18n } from '@/app/hooks';
import type { ThemeType } from '@/app/hooks/use-theme';

interface NotificationEmptyStateProps {
  theme: ThemeType;
}

export function NotificationEmptyState({ theme }: NotificationEmptyStateProps) {
  const { t } = useI18n();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <div className="p-6">
      <DashboardEmptyState
        title={t('notifications.empty.title')}
        description={t('notifications.empty.description')}
        surface={{
          ...surface,
          cardShadow: '',
          panelMuted: surface.panel,
        }}
        icon={Bell}
        compact
        className="mx-auto max-w-sm"
      />
    </div>
  );
}
