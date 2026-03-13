import { memo, useState } from 'react';
import { toast } from 'sonner';
import { isCompactCardSize } from '@/app/components/shared/card-size-selector';
import { useHomeAssistant, useTheme } from '@/app/hooks';
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
  const { entities } = useHomeAssistant();
  const { theme, colors, primaryColor } = useTheme();
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
  } = useRSSFeedSources(cardId);
  const { latestArticle, mediumArticles, largeArticles, isLoading, error } = useRSSFeedItems(
    selectedProviders,
    entities
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
        `Deleted ${removedCount} feed${removedCount === 1 ? '' : 's'} and cleared ${deselectedCount} Home Assistant source${deselectedCount === 1 ? '' : 's'}`
      );
      return;
    }

    if (removedCount > 0) {
      toast.success(`Deleted ${removedCount} feed${removedCount === 1 ? '' : 's'}`);
      return;
    }

    toast.success(
      `Cleared ${deselectedCount} Home Assistant source${deselectedCount === 1 ? '' : 's'}`
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
        mediumArticles={mediumArticles}
        largeArticles={largeArticles}
        handleArticleClick={handleArticleClick}
        isLoading={isLoading}
        error={error}
        hasConfiguredProviders={providers.length > 0}
        hasSelectedProviders={selectedProviderIds.length > 0}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <RSSFeedSettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        title="this RSS card"
        theme={theme}
        providers={providers}
        selectedProviderIds={selectedProviderIds}
        onSelectedProviderIdsChange={setSelectedProviderIds}
        onAddProvider={(name, feedUrl) => {
          try {
            new URL(feedUrl);
          } catch {
            toast.error('Enter a valid feed URL');
            return false;
          }

          const nextProvider = addProvider(name, feedUrl);
          if (!nextProvider) {
            toast.error('Add a name and feed URL');
            return false;
          }

          toast.success(`Added ${nextProvider.name}`);
          return true;
        }}
        onRemoveProvider={(providerId) => {
          const provider = providers.find((candidate) => candidate.id === providerId);
          removeProvider(providerId);
          if (provider) {
            toast.success(`Removed ${provider.name}`);
          }
        }}
        onDeleteSelectedProviders={handleDeleteSelectedProviders}
      />
    </>
  );
});
