import { Settings2 } from 'lucide-react';
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
    <div className="flex flex-1 flex-col justify-center text-left">
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
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onOpenSettings();
          }}
          className={`mt-4 inline-flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-opacity hover:opacity-70 ${rssSurface.hoverClassName}`}
          style={{ color: rssSurface.textPrimaryColor }}
        >
          <Settings2 className="h-3.5 w-3.5" />
          {t('rss.configureProviders')}
        </button>
      )}
    </div>
  );
}
