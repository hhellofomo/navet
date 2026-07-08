import type { CardSize } from '@/app/components/shared/card-size-selector';
import { memo } from 'react';
import { useTheme } from '../../../contexts/theme-context';
import { RSSFeedCardView } from './RSSFeedCardView';

interface RSSItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  url: string;
  excerpt?: string;
  imageUrl?: string;
}

interface RSSFeedCardContainerProps {
  inEditMode?: boolean;
  size?: CardSize;
  onSizeChange?: (size: CardSize) => void;
}

// Mock RSS feed data
const mockRSSItems: RSSItem[] = [
  {
    id: '1',
    title: 'New AI Model Achieves State-of-the-Art Performance',
    source: 'TechCrunch',
    timeAgo: '2h ago',
    url: '#',
    excerpt: 'Researchers unveil breakthrough in natural language processing...',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    title: 'Climate Summit Reaches Historic Agreement',
    source: 'BBC News',
    timeAgo: '4h ago',
    url: '#',
    excerpt: 'World leaders commit to ambitious carbon reduction targets...',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=400&h=200&fit=crop',
  },
  {
    id: '3',
    title: 'Markets Rally on Strong Economic Data',
    source: 'Financial Times',
    timeAgo: '5h ago',
    url: '#',
    excerpt: 'Stock indices reach new highs amid positive employment figures...',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
  },
  {
    id: '4',
    title: 'Breakthrough in Quantum Computing',
    source: 'Nature',
    timeAgo: '7h ago',
    url: '#',
    excerpt: 'Scientists demonstrate quantum advantage in practical applications...',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop',
  },
  {
    id: '5',
    title: 'SpaceX Successfully Launches Next Generation Satellite',
    source: 'Space.com',
    timeAgo: '9h ago',
    url: '#',
    excerpt: 'Latest mission marks milestone in global internet coverage...',
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&h=200&fit=crop',
  },
];

export const RSSFeedCardContainer = memo(function RSSFeedCardContainer({
  inEditMode = false,
  size = 'medium',
  onSizeChange,
}: RSSFeedCardContainerProps) {
  const { theme, colors, primaryColor } = useTheme();
  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const _isLarge = size === 'large';

  const handleArticleClick = (url: string) => {
    if (!inEditMode) {
      window.open(url, '_blank');
    }
  };

  const latestArticle = mockRSSItems[0];
  const mediumArticles = mockRSSItems.slice(0, 3);
  const largeArticles = mockRSSItems.slice(0, 5);

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
