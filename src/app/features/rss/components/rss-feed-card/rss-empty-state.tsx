import { Settings2 } from 'lucide-react';
import { Button } from '@/app/components/primitives';
import { useI18n } from '@/app/hooks';
import type { RSSFeedCardSurfaceTokens } from './surface-tokens';

interface RSSEmptyStateProps {
  hasConfiguredProviders: boolean;
  hasSelectedProviders: boolean;
  error: string | null;
  inEditMode: boolean;
  rssSurface: RSSFeedCardSurfaceTokens;
  onOpenSettings: () => void;
}

export function RSSEmptyState({
  hasConfiguredProviders,
  hasSelectedProviders,
  error,
  inEditMode,
  rssSurface,
  onOpenSettings,
}: RSSEmptyStateProps) {
  const { t } = useI18n();
  const emptyMessage = !hasConfiguredProviders
    ? t('rss.empty.noProviders')
    : !hasSelectedProviders
      ? t('rss.empty.noSelection')
      : error
        ? error
        : t('rss.empty.noArticles');

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <p className="mt-2 text-sm leading-relaxed" style={{ color: rssSurface.textSecondaryColor }}>
        {emptyMessage}
      </p>
      {inEditMode ? (
        <div
          className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium"
          style={{ color: rssSurface.textPrimaryColor }}
        >
          <Settings2 className="h-3.5 w-3.5" />
          {t('rss.configureProviders')}
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="small"
          leading={<Settings2 className="h-3.5 w-3.5" />}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onOpenSettings();
          }}
          className={`mt-4 ${rssSurface.hoverClassName}`}
          style={{ color: rssSurface.textPrimaryColor }}
        >
          {t('rss.configureProviders')}
        </Button>
      )}
    </div>
  );
}
