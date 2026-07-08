import { memo } from 'react';
import { useTheme } from '@/app/hooks';
import { RSSFeedCardView } from './RSSFeedCardView';
import { MOCK_RSS_ITEMS } from './rss-feed-card.data';
import type { RSSFeedCardProps } from './rss-feed-card.types';

export const RSSFeedCardContainer = memo(function RSSFeedCardContainer({
  inEditMode = false,
  size = 'medium',
  onSizeChange,
}: RSSFeedCardProps) {
  const { theme, colors, primaryColor } = useTheme();
  const isSmall = size === 'extra-small' || size === 'small';
  const isMedium = size === 'medium';

  const handleArticleClick = (url: string) => {
    if (!inEditMode) {
      window.open(url, '_blank');
    }
  };

  const latestArticle = MOCK_RSS_ITEMS[0];
  const mediumArticles = MOCK_RSS_ITEMS.slice(0, 3);
  const largeArticles = MOCK_RSS_ITEMS.slice(0, 5);

  return (
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
    />
  );
});
