import { ChevronRight, Rss } from 'lucide-react';
import type { CardSize } from '../../../components/shared/card-size-selector';
import { CardSizeSelector } from '../../../components/shared/card-size-selector';
import type { PrimaryColor, ThemeType } from '../../../hooks';

interface RSSItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  url: string;
  excerpt?: string;
  imageUrl?: string;
}

interface RSSFeedCardViewProps {
  inEditMode?: boolean;
  size?: CardSize;
  onSizeChange?: (size: CardSize) => void;
  theme: ThemeType;
  primaryColor: PrimaryColor;
  colors: {
    rss: {
      gradient: string;
      border: string;
      glow: string;
    };
  };
  isSmall: boolean;
  isMedium: boolean;
  latestArticle: RSSItem;
  mediumArticles: RSSItem[];
  largeArticles: RSSItem[];
  handleArticleClick: (url: string) => void;
}

export function RSSFeedCardView({
  inEditMode = false,
  size = 'medium',
  onSizeChange,
  theme,
  primaryColor,
  colors,
  isSmall,
  isMedium,
  latestArticle,
  mediumArticles,
  largeArticles,
  handleArticleClick,
}: RSSFeedCardViewProps) {
  const colorMap = {
    orange: { strong: '#c2410c', base: '#f97316', soft: '#fed7aa' },
    blue: { strong: '#1d4ed8', base: '#3b82f6', soft: '#bfdbfe' },
    green: { strong: '#15803d', base: '#22c55e', soft: '#bbf7d0' },
    purple: { strong: '#7e22ce', base: '#a855f7', soft: '#e9d5ff' },
    pink: { strong: '#be185d', base: '#ec4899', soft: '#fbcfe8' },
    red: { strong: '#b91c1c', base: '#ef4444', soft: '#fecaca' },
    yellow: { strong: '#a16207', base: '#eab308', soft: '#fef08a' },
    teal: { strong: '#0f766e', base: '#14b8a6', soft: '#99f6e4' },
  } as const;
  const accentColor = colorMap[primaryColor];
  // Theme-aware colors
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-white/60';
  const overlayBg =
    theme === 'light' ? 'bg-white/60 backdrop-blur-sm' : 'bg-black/20 backdrop-blur-sm';
  const dividerColor = theme === 'light' ? 'bg-gray-200' : 'bg-white/10';
  const hoverBg = theme === 'light' ? 'hover:bg-gray-100/80' : 'hover:bg-white/5';
  const dotColor = theme === 'light' ? 'text-gray-300' : 'text-white/40';
  const excerptColor = theme === 'light' ? 'text-gray-500' : 'text-white/70';
  const readMoreColor = theme === 'light' ? 'text-gray-600' : 'text-white/80';

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

          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ml-2 ${
              theme === 'light' ? '' : 'backdrop-blur-sm'
            }`}
            style={{
              backgroundColor: theme === 'light' ? accentColor.soft : `${accentColor.base}33`,
            }}
          >
            <Rss
              className="w-5 h-5"
              style={{ color: theme === 'light' ? accentColor.base : '#ffffff' }}
            />
          </div>
        </div>

        {inEditMode && onSizeChange && (
          <CardSizeSelector currentSize={size} onSizeChange={onSizeChange} />
        )}

        {isSmall ? (
          // Small: Single latest article
          <div className="flex-1 flex flex-col justify-between items-start text-left">
            <div className="w-full">
              <h3
                className={`text-lg font-semibold ${textPrimary} leading-tight mb-2 line-clamp-2 text-left`}
              >
                {latestArticle.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs">
                <span style={{ color: theme === 'light' ? accentColor.strong : accentColor.soft }}>
                  {latestArticle.source}
                </span>
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
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/item cursor-pointer ${hoverBg} rounded-lg p-2 -m-2 transition-colors text-left block no-underline`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArticleClick(item.url);
                  }}
                >
                  <h3
                    className={`text-sm font-semibold ${textPrimary} leading-tight mb-1 line-clamp-2 transition-colors text-left`}
                  >
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span
                      style={{ color: theme === 'light' ? accentColor.strong : accentColor.soft }}
                    >
                      {item.source}
                    </span>
                    <span className={dotColor}>•</span>
                    <span className={textSecondary}>{item.timeAgo}</span>
                  </div>
                  {index < mediumArticles.length - 1 && (
                    <div className={`h-px ${dividerColor} mt-3`} />
                  )}
                </a>
              ))}
            </div>
          </div>
        ) : (
          // Large: Articles with images
          <div className="flex-1 overflow-hidden">
            <div className="space-y-2">
              {largeArticles.map((item, index) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/item cursor-pointer ${hoverBg} rounded-xl p-2 -m-2 transition-colors text-left block no-underline`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArticleClick(item.url);
                  }}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    {item.imageUrl && (
                      <div
                        className={`w-20 h-20 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-white/10'} overflow-hidden flex-shrink-0`}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-80 group-hover/item:opacity-100 transition-opacity"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left">
                      <h3
                        className={`text-sm font-semibold ${textPrimary} leading-tight mb-1 line-clamp-2 transition-colors text-left`}
                      >
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs mb-1">
                        <span
                          style={{
                            color: theme === 'light' ? accentColor.strong : accentColor.soft,
                          }}
                        >
                          {item.source}
                        </span>
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
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
