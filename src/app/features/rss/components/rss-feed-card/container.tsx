import { memo, useState } from 'react';
import { toast } from 'sonner';
import { isCompactCardSize } from '@/app/components/shared/card-size-selector';
import { useHomeAssistant, useI18n, useTheme } from '@/app/hooks';
import { homeAssistantSelectors } from '@/app/stores/selectors';
import { RSSFeedSettingsDialog } from './settings-dialog';
import type { RSSFeedCardProps } from './types';
import { useRSSFeedItems } from './use-rss-feed-items';
import { useRSSFeedSources } from './use-rss-feed-sources';
import { RSSFeedCardView } from './view';

export const RSSFeedCardContainer = memo(function RSSFeedCardContainer({
  cardId,
  inEditMode = false,
  size = 'medium',
  onSizeChange,
}: RSSFeedCardProps) {
  const entities = useHomeAssistant(homeAssistantSelectors.entities);
  const { theme, colors, primaryColor } = useTheme();
  const { t } = useI18n();
  const isSmall = isCompactCardSize(size);
  const isMedium = size === 'medium';
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const {
    providers,
    selectedProviders,
    selectedProviderIds,
    setSelectedProviderIds,
    addProvider,
    removeProvider,
    articleCount,
    setArticleCount,
  } = useRSSFeedSources(cardId);
  const { latestArticle, items, isLoading, error } = useRSSFeedItems(
    selectedProviders,
    entities,
    articleCount
  );

  const handleArticleClick = (url: string) => {
    if (!inEditMode) {
      window.open(url, '_blank');
    }
  };

  const handleDeleteSelectedProviders = () => {
    const selectedDirectProviders = providers.filter(
      (provider) => selectedProviderIds.includes(provider.id) && provider.type === 'url'
    );

    selectedDirectProviders.forEach((provider) => {
      removeProvider(provider.id);
    });

    setSelectedProviderIds([]);

    if (selectedProviderIds.length === 0) {
      return;
    }

    const removedCount = selectedDirectProviders.length;
    const deselectedCount = selectedProviderIds.length - removedCount;

    if (removedCount > 0 && deselectedCount > 0) {
      toast.success(
        t('rss.feedback.deletedAndCleared', { feeds: removedCount, sources: deselectedCount })
      );
      return;
    }

    if (removedCount > 0) {
      toast.success(
        removedCount === 1
          ? t('rss.feedback.deletedFeed.one', { count: removedCount })
          : t('rss.feedback.deletedFeed.other', { count: removedCount })
      );
      return;
    }

    toast.success(
      deselectedCount === 1
        ? t('rss.feedback.clearedSource.one', { count: deselectedCount })
        : t('rss.feedback.clearedSource.other', { count: deselectedCount })
    );
  };

  return (
    <>
      <RSSFeedCardView
        inEditMode={inEditMode}
        size={size}
        onSizeChange={onSizeChange}
        theme={theme}
        primaryColor={primaryColor}
        colors={colors}
        isSmall={isSmall}
        isMedium={isMedium}
        latestArticle={latestArticle}
        items={items}
        handleArticleClick={handleArticleClick}
        isLoading={isLoading}
        error={error}
        hasConfiguredProviders={providers.length > 0}
        hasSelectedProviders={selectedProviderIds.length > 0}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      {isSettingsOpen ? (
        <RSSFeedSettingsDialog
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          title={t('rss.title')}
          theme={theme}
          providers={providers}
          selectedProviderIds={selectedProviderIds}
          onSelectedProviderIdsChange={setSelectedProviderIds}
          onAddProvider={(name, feedUrl) => {
            try {
              new URL(feedUrl);
            } catch {
              toast.error(t('rss.feedback.invalidUrl'));
              return false;
            }

            const nextProvider = addProvider(name, feedUrl);
            if (!nextProvider) {
              toast.error(t('rss.feedback.addNameAndUrl'));
              return false;
            }

            toast.success(t('rss.feedback.addedProvider', { name: nextProvider.name }));
            return true;
          }}
          onRemoveProvider={(providerId) => {
            const provider = providers.find((candidate) => candidate.id === providerId);
            removeProvider(providerId);
            if (provider) {
              toast.success(t('rss.feedback.removedProvider', { name: provider.name }));
            }
          }}
          articleCount={articleCount}
          onArticleCountChange={setArticleCount}
          onDeleteSelectedProviders={handleDeleteSelectedProviders}
        />
      ) : null}
    </>
  );
});
