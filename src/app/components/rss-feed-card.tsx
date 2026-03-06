import { memo, useState } from 'react';
import { Rss, ExternalLink, Clock, ChevronRight } from 'lucide-react';
import { CardSizeSelector, type CardSize } from './card-size-selector';
import { useTheme } from '../contexts/theme-context';

interface RSSItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  url: string;
  excerpt?: string;
  imageUrl?: string;
}

interface RSSFeedCardProps {
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
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Climate Summit Reaches Historic Agreement',
    source: 'BBC News',
    timeAgo: '4h ago',
    url: '#',
    excerpt: 'World leaders commit to ambitious carbon reduction targets...',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Markets Rally on Strong Economic Data',
    source: 'Financial Times',
    timeAgo: '5h ago',
    url: '#',
    excerpt: 'Stock indices reach new highs amid positive employment figures...',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop'
  },
  {
    id: '4',
    title: 'Breakthrough in Quantum Computing',
    source: 'Nature',
    timeAgo: '7h ago',
    url: '#',
    excerpt: 'Scientists demonstrate quantum advantage in practical applications...',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop'
  },
  {
    id: '5',
    title: 'SpaceX Successfully Launches Next Generation Satellite',
    source: 'Space.com',
    timeAgo: '9h ago',
    url: '#',
    excerpt: 'Latest mission marks milestone in global internet coverage...',
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&h=200&fit=crop'
  }
];

export const RSSFeedCard = memo(function RSSFeedCard({ 
  inEditMode = false,
  size = 'medium',
  onSizeChange
}: RSSFeedCardProps) {
  const { theme, colors } = useTheme();
  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  // Theme-aware colors
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-white/60';
  const textAccent = theme === 'light' ? 'text-orange-700' : 'text-orange-200';
  const overlayBg = theme === 'light' ? 'bg-white/60 backdrop-blur-sm' : 'bg-black/20 backdrop-blur-sm';
  const iconBg = theme === 'light' ? 'bg-orange-100' : 'bg-white/10 backdrop-blur-sm';
  const iconColor = theme === 'light' ? 'text-orange-600' : 'text-white';
  const dividerColor = theme === 'light' ? 'bg-gray-200' : 'bg-white/10';
  const hoverBg = theme === 'light' ? 'hover:bg-gray-100/80' : 'hover:bg-white/5';
  const hoverText = theme === 'light' ? 'group-hover/item:text-orange-700' : 'group-hover/item:text-orange-100';
  const dotColor = theme === 'light' ? 'text-gray-300' : 'text-white/40';
  const excerptColor = theme === 'light' ? 'text-gray-500' : 'text-white/70';
  const readMoreColor = theme === 'light' ? 'text-gray-600' : 'text-white/80';

  const handleArticleClick = (url: string) => {
    if (!inEditMode) {
      window.open(url, '_blank');
    }
  };

  const latestArticle = mockRSSItems[0];
  const mediumArticles = mockRSSItems.slice(0, 3);
  const largeArticles = mockRSSItems.slice(0, 5);

  return (
    <div
      className={`
        relative group overflow-hidden
        h-full w-full rounded-3xl
        bg-gradient-to-br ${colors.rss.gradient}
        backdrop-blur-xl border ${colors.rss.border}
        ${theme === 'light' ? 'shadow-lg' : 'shadow-lg hover:shadow-xl'}
        transition-all duration-300
        ${inEditMode ? 'cursor-move' : 'cursor-default'}
      `}
    >
      {/* Glass overlay */}
      <div className={`absolute inset-0 ${overlayBg}`} />
      
      {/* Subtle glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.rss.glow} to-transparent`} />
      
      {/* Content */}
      <div className="relative h-full flex flex-col p-4">
        {/* Header */}
        <div className={`flex items-start justify-between ${isSmall ? 'mb-2' : 'mb-3'}`}>
          <div className="min-w-0 flex-1 text-left">
            <span className={`font-semibold ${textPrimary} text-sm text-left`}>News Feed</span>
          </div>
          
          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ml-2`}>
            <Rss className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
        
        {inEditMode && onSizeChange && (
          <CardSizeSelector
            currentSize={size}
            onSizeChange={onSizeChange}
          />
        )}

        {isSmall ? (
          // Small: Single latest article
          <div className="flex-1 flex flex-col justify-between items-start text-left">
            <div className="w-full">
              <h3 className={`text-lg font-semibold ${textPrimary} leading-tight mb-2 line-clamp-2 text-left`}>
                {latestArticle.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs">
                <span className={textAccent}>{latestArticle.source}</span>
                <span className={dotColor}>•</span>
                <span className={textSecondary}>{latestArticle.timeAgo}</span>
              </div>
            </div>
            
            <div className={`flex items-center gap-1 text-xs ${readMoreColor}`}>
              <span>Read more</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        ) : isMedium ? (
          // Medium: 3 articles in list
          <div className="flex-1 overflow-hidden">
            <div className="space-y-3">
              {mediumArticles.map((item, index) => (
                <div
                  key={item.id}
                  className={`group/item cursor-pointer ${hoverBg} rounded-lg p-2 -m-2 transition-colors text-left`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArticleClick(item.url);
                  }}
                >
                  <h3 className={`text-sm font-semibold ${textPrimary} leading-tight mb-1 line-clamp-2 ${hoverText} transition-colors text-left`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={textAccent}>{item.source}</span>
                    <span className={dotColor}>•</span>
                    <span className={textSecondary}>{item.timeAgo}</span>
                  </div>
                  {index < mediumArticles.length - 1 && (
                    <div className={`h-px ${dividerColor} mt-3`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Large: Articles with images
          <div className="flex-1 overflow-hidden">
            <div className="space-y-2">
              {largeArticles.map((item, index) => (
                <div
                  key={item.id}
                  className={`group/item cursor-pointer ${hoverBg} rounded-xl p-2 -m-2 transition-colors text-left`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArticleClick(item.url);
                  }}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    {item.imageUrl && (
                      <div className={`w-20 h-20 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-white/10'} overflow-hidden flex-shrink-0`}>
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover opacity-80 group-hover/item:opacity-100 transition-opacity"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className={`text-sm font-semibold ${textPrimary} leading-tight mb-1 line-clamp-2 ${hoverText} transition-colors text-left`}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs mb-1">
                        <span className={textAccent}>{item.source}</span>
                        <span className={dotColor}>•</span>
                        <span className={textSecondary}>{item.timeAgo}</span>
                      </div>
                      {item.excerpt && (
                        <p className={`text-xs ${excerptColor} line-clamp-1 text-left`}>
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                  {index < largeArticles.length - 1 && (
                    <div className={`h-px ${dividerColor} mt-2`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});