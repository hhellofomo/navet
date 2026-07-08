import { memo } from 'react';
import { isCompactCardSize } from '@/app/components/shared/card-size-selector';
import { useTheme } from '@/app/hooks';
import { MOCK_RSS_ITEMS } from './data';
import type { RSSFeedCardProps } from './types';
import { RSSFeedCardView } from './view';

export const RSSFeedCardContainer = memo(function RSSFeedCardContainer({
  inEditMode = false,
  size = 'medium',
  onSizeChange,
}: RSSFeedCardProps) {
  const { theme, colors, primaryColor } = useTheme();
  const isSmall = isCompactCardSize(size);
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
